import { useCallback } from 'react';
import api from '@/lib/axios';

const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer;
}

export function useNotifications() {
  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    if (!vapidKey) return false;

    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    const sub = existing ?? (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    }));

    const json = sub.toJSON();
    await api.post('/api/push/subscribe', {
      endpoint: json.endpoint,
      keys: json.keys,
      expirationTime: json.expirationTime,
    });
    return true;
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await api.delete('/api/push/unsubscribe', { data: { endpoint: sub.endpoint } });
    await sub.unsubscribe();
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    return Notification.requestPermission();
  }, []);

  return { subscribe, unsubscribe, requestPermission };
}
