import webpush from 'web-push';
import { PushSubscription } from '../models/PushSubscription.model';
import { env } from '../config/env';

if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    env.VAPID_SUBJECT,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushToUser(userId: string, payload: object): Promise<void> {
  const subscriptions = await PushSubscription.find({ userId });
  const dead: string[] = [];

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify(payload)
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 410 || statusCode === 404) {
          dead.push(sub._id.toString());
        }
      }
    })
  );

  if (dead.length > 0) {
    await PushSubscription.deleteMany({ _id: { $in: dead } });
  }
}

export async function subscribeUser(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string }; expirationTime?: number | null },
  userAgent?: string
): Promise<void> {
  await PushSubscription.findOneAndUpdate(
    { endpoint: subscription.endpoint },
    {
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      expirationTime: subscription.expirationTime ? new Date(subscription.expirationTime) : undefined,
      userAgent,
    },
    { upsert: true, new: true }
  );
}

export async function unsubscribeUser(userId: string, endpoint: string): Promise<void> {
  await PushSubscription.deleteOne({ userId, endpoint });
}
