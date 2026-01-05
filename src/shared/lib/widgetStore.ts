import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetState {
  order: string[];
  collapsed: Record<string, boolean>;
  setOrder: (newOrder: string[]) => void;
  toggleCollapse: (id: string) => void;
}

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      // Default order of widgets
      order: ['prayer', 'qibla', 'wisdom', 'zakat', 'ai', 'affiliate'],
      collapsed: {},
      setOrder: (newOrder) => set({ order: newOrder }),
      toggleCollapse: (id) => set((state) => ({
        collapsed: { ...state.collapsed, [id]: !state.collapsed[id] }
      })),
    }),
    { name: 'sakina-widget-layout' }
  )
);