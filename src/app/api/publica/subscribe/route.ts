import { NextRequest, NextResponse } from 'next/server';
import { subscribeUser } from '@/app/actions/pwaActions';

export async function POST(req: NextRequest) {
  const sub = await req.json();
  try {
    await subscribeUser(sub);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao salvar subscription' }, { status: 500 });
  }
}
