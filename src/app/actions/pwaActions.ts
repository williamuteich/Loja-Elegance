'use server'

import webpush, { PushSubscription as WebPushSubscription } from 'web-push';
import { prisma } from '@/lib/prisma';

webpush.setVapidDetails(
  'mailto:seu-email@dominio.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)


export async function subscribeUser(sub: any) {
  const subscription = JSON.parse(JSON.stringify(sub)) as WebPushSubscription;
  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { keys: subscription.keys },
    create: {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    },
  });
  return { success: true };
}

export async function unsubscribeUser(endpoint: string) {
  // Remove a subscription pelo endpoint
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return { success: true };
}

export async function sendNotification(message: string) {
  // Envia para todas as subscriptions cadastradas
  const subscriptions = await prisma.pushSubscription.findMany();
  let successCount = 0;
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as { p256dh: string; auth: string },
        },
        JSON.stringify({
          title: 'Notificação Loja Elegance',
          body: message,
          icon: '/icon-192x192.png',
        })
      );
      successCount++;
    } catch (error) {
      // Se falhar, pode ser subscription inválida/remover depois
    }
  }
  return { success: true, sent: successCount };
}
