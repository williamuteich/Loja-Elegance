'use server'

import webpush, { PushSubscription as WebPushSubscription } from 'web-push';

webpush.setVapidDetails(
  'mailto:seu-email@dominio.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)


let subscription: WebPushSubscription | null = null;

export async function subscribeUser(sub: any) {
  subscription = JSON.parse(JSON.stringify(sub)) as WebPushSubscription;
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) throw new Error('No subscription available')
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Notificação Loja Elegance',
        body: message,
        icon: '/icon-192x192.png',
      })
    )
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to send notification' }
  }
}
