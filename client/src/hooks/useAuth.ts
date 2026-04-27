import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (store.accessToken) return;
    axios
      .post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const { accessToken, user } = res.data.data;
        store.login(user, accessToken);
      })
      .catch(() => {
        store.logout();
      });
  }, []);

  return store;
}

export function useRequireAuth() {
  return useAuthStore((s) => ({ user: s.user, isLoading: s.isLoading }));
}
