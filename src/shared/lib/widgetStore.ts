import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetState {
  collapsed: Record<string, boolean>;
  order: string[];
  toggleCollapse: (id: string) => void;
  setOrder: (order: string[]) => void;
}

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      collapsed: {},
      // [FACTS]: Default order includes your new Halal Scanner
      order: [
        'daily-wisdom',
        'halal-scanner', 
        'prayer-times',
        'names-of-allah',
        'smart-dhikr',
        'qibla',
        'mosque-finder',
        'ai-assistant',
        'kids-zone',
        'zakat'
      ],
      toggleCollapse: (id) =>
        set((state) => ({
          collapsed: { ...state.collapsed, [id]: !state.collapsed[id] },
        })),
      setOrder: (order) => set({ order }),
    }),
    {
      name: 'sakina-widget-storage', // Saves to localStorage so settings persist
    }
  )
);