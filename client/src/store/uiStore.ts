import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UiState, Theme } from '@/types';

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light' as Theme,
      sidebarOpen: true,
      activeModal: null,
      commandPaletteOpen: false,

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else if (theme === 'light') root.classList.remove('dark');
        else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          prefersDark ? root.classList.add('dark') : root.classList.remove('dark');
        }
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      openModal: (name) => set({ activeModal: name }),
      closeModal: () => set({ activeModal: null }),
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
    }),
    { name: 'taskmaster-ui', partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen }) }
  )
);
