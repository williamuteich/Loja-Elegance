import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RateLimit, getClientIP } from '@/lib/rateLimit';

const MP_TOKEN = process.env.NEXT_ACCESS_TOKEN;
const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET; 

function normalizeTopic(type: string | null | undefined): 'payment' | 'merchant_order' | 'unknown' {
  const t = (type || '').toLowerCase();
  if (t.includes('merchant_order')) return 'merchant_order';
  if (t.includes('payment')) return 'payment';
  return 'unknown';
}

function canTransition(current: string, next: string): boolean {
  const map: Record<string, Set<string>> = {
    pending: new Set(['paid', 'failed', 'cancelled', 'refunded']),
    paid: new Set(['refunded']),
    cancelled: new Set([]),
    failed: new Set(['paid']),
    refunded: new Set([]),
  };
  const from = (current || 'pending').toLowerCase();
  const to = (next || '').toLowerCase();
  const allowed = map[from] || new Set<string>();
  return allowed.has(to) || from === to;
}

function isFinalStatus(status: string): boolean {
  return ['paid', 'failed', 'cancelled', 'refunded'].includes((status || '').toLowerCase());
}

async function clearCart(cartId: string | null | undefined) {
  if (!cartId) return;
  try {
    await prisma.cartItem.deleteMany({ where: { cartId } });
    // Opcional: expirar o carrinho imediatamente
    await prisma.cart.update({ where: { id: cartId }, data: { expireAt: new Date() } }).catch(() => {});
  } catch {}
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    if (!MP_TOKEN) {
      return NextResponse.json({ error: 'Mercado Pago token ausente' }, { status: 500 });
    }

    const ip = getClientIP(req as unknown as Request);
    const rl = await RateLimit.check(ip, { windowMs: 60_000, maxRequests: 120, keyPrefix: 'webhook:mp' });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const qp = req.nextUrl.searchParams;
    const token = qp.get('t') || qp.get('token');
    if (WEBHOOK_SECRET && token !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({} as any));
    const typeRaw = (body?.type || body?.action || body?.topic || qp.get('type') || qp.get('topic') || '').toString();
    const topic = normalizeTopic(typeRaw);
    const paymentId = body?.data?.id || body?.id || qp.get('data.id') || (topic === 'payment' ? qp.get('id') : null);
    const requestId = req.headers.get('x-request-id') || undefined;
    const signature = req.headers.get('x-signature') || undefined; // pode ser usado posteriormente

    // Se vier merchant_order, buscar a ordem do merchant e atualizar por preference_id
    if (topic === 'merchant_order') {
      const moId = qp.get('id') || (typeof body?.resource === 'string' ? body.resource.split('/').pop() : undefined);
      if (!moId) {
        return NextResponse.json({ ignored: true, reason: 'merchant_order id ausente' });
      }

      // Idempotência: registrar evento
      const event = await prisma.webhookEvent.upsert({
        where: { provider_topic_externalId: { provider: 'mercadopago', topic: 'merchant_order', externalId: String(moId) } },
        update: {},
        create: {
          provider: 'mercadopago',
          topic: 'merchant_order',
          externalId: String(moId),
          requestId,
          signature,
        },
      }).catch(() => {
        return null;
      });
      if (event === null) {
        return NextResponse.json({ ok: true, deduped: true });
      }

      const moRes = await fetch(`https://api.mercadopago.com/merchant_orders/${moId}`, {
        headers: { Authorization: `Bearer ${MP_TOKEN}` },
        cache: 'no-store',
      });
      if (!moRes.ok) {
        return NextResponse.json({ error: 'Falha ao buscar merchant_order' }, { status: 500 });
      }
      const mo = await moRes.json();
      const prefId = mo?.preference_id as string | undefined;
      if (!prefId) {
        return NextResponse.json({ ignored: true, reason: 'merchant_order sem preference_id' });
      }
      const pays: any[] = Array.isArray(mo?.payments) ? mo.payments : [];
      let mapped = 'pending';
      if (pays.some(p => p.status === 'approved')) mapped = 'paid';
      else if (pays.some(p => p.status === 'refunded' || p.status === 'charged_back')) mapped = 'refunded';
      else if (pays.some(p => p.status === 'cancelled' || p.status === 'expired')) mapped = 'cancelled';
      const order = await prisma.order.findFirst({ where: { preferenceId: prefId } });
      if (!order) {
        await prisma.webhookEvent.update({ where: { id: event.id }, data: { payload: mo, statusApplied: 'none', processedAt: new Date() } });
        return NextResponse.json({ ok: true, updated: 0 });
      }
      // Checagem de valor quando marcando como pago
      if (mapped === 'paid') {
        const paidAmount = Number(mo?.paid_amount || 0);
        const total = Number(order.total || 0);
        if (paidAmount + 0.01 < total) {
          mapped = 'pending';
        }
      }
      if (order.status !== mapped && canTransition(order.status, mapped)) {
        await prisma.order.update({ where: { id: order.id }, data: { status: mapped } });
        await prisma.webhookEvent.update({ where: { id: event.id }, data: { payload: mo, orderId: order.id, statusApplied: mapped, processedAt: new Date() } });
      } else {
        await prisma.webhookEvent.update({ where: { id: event.id }, data: { payload: mo, orderId: order.id, statusApplied: 'skipped', processedAt: new Date() } });
      }
      if (isFinalStatus(mapped)) {
        await clearCart(order.cartId);
      }
      return NextResponse.json({ ok: true, status: mapped });
    }

    if (!paymentId || topic !== 'payment') {
      return NextResponse.json({ ignored: true });
    }

    // Idempotência: registrar evento
    const event = await prisma.webhookEvent.upsert({
      where: { provider_topic_externalId: { provider: 'mercadopago', topic: 'payment', externalId: String(paymentId) } },
      update: {},
      create: {
        provider: 'mercadopago',
        topic: 'payment',
        externalId: String(paymentId),
        requestId,
        signature,
      },
    }).catch(() => {
      return null;
    });
    if (event === null) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Falha ao buscar pagamento' }, { status: 500 });
    }

    const payment = await res.json();
    const prefId: string | undefined = payment?.preference_id;
    const status: string | undefined = payment?.status;

    if (!prefId) {
      await prisma.webhookEvent.update({ where: { id: event.id }, data: { payload: payment, statusApplied: 'none', processedAt: new Date() } });
      return NextResponse.json({ error: 'preference_id ausente no pagamento' }, { status: 400 });
    }

    let mapped: string = 'pending';
    switch (status) {
      case 'approved':
        mapped = 'paid';
        break;
      case 'rejected':
        mapped = 'failed';
        break;
      case 'cancelled':
      case 'expired':
        mapped = 'cancelled';
        break;
      case 'refunded':
      case 'charged_back':
        mapped = 'refunded';
        break;
      case 'in_process':
      case 'pending':
      default:
        mapped = 'pending';
    }
    const order = await prisma.order.findFirst({ where: { preferenceId: prefId } });
    if (!order) {
      await prisma.webhookEvent.update({ where: { id: event.id }, data: { payload: payment, statusApplied: 'none', processedAt: new Date() } });
      return NextResponse.json({ ok: true, updated: 0 });
    }

    // Verificação opcional de valor total via merchant_order search quando marcando como pago
    if (mapped === 'paid') {
      try {
        const moSearch = await fetch(`https://api.mercadopago.com/merchant_orders/search?preference_id=${encodeURIComponent(prefId)}`, {
          headers: { Authorization: `Bearer ${MP_TOKEN}` },
          cache: 'no-store',
        });
        if (moSearch.ok) {
          const mos = await moSearch.json();
          const moFirst = Array.isArray(mos?.elements) ? mos.elements[0] : undefined;
          const paidAmount = Number(moFirst?.paid_amount || 0);
          const total = Number(order.total || 0);
          if (paidAmount + 0.01 < total) {
            mapped = 'pending';
          }
        }
      } catch (e) {
      }
    }

    if (order.status !== mapped && canTransition(order.status, mapped)) {
      await prisma.order.update({ where: { id: order.id }, data: { status: mapped } });
      await prisma.webhookEvent.update({ where: { id: event.id }, data: { payload: payment, orderId: order.id, statusApplied: mapped, processedAt: new Date() } });
    } else {
      await prisma.webhookEvent.update({ where: { id: event.id }, data: { payload: payment, orderId: order.id, statusApplied: 'skipped', processedAt: new Date() } });
    }
    if (isFinalStatus(mapped)) {
      await clearCart(order.cartId);
    }

    return NextResponse.json({ ok: true, status: mapped });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
