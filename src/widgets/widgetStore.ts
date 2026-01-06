import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define the Shape of our Store (This fixes the "Property does not exist" errors)
interface WidgetState {
  order: string[];
  hidden: string[];
  moveWidget: (id: string, direction: 'up' | 'down') => void;
  toggleVisibility: (id: string) => void;
  resetLayout: () => void;
  ensureWidgetsExist: (ids: string[]) => void;
}

// 2. Export the Default List (This fixes "no exported member DEFAULT_WIDGETS")
export const DEFAULT_WIDGETS = [
  'prayer-times',
  'affiliate-dock',
  'journal',
  'dream-interpreter',
  'soul-comfort',
  'daily-wisdom',
  'halal-scanner',
  'names-of-allah',
  'smart-dhikr',
  'qibla',
  'mosque-finder',
  'zakat'
];

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      order: DEFAULT_WIDGETS,
      hidden: [],

      // Logic to swap widget positions
      moveWidget: (id, direction) =>
        set((state) => {
          const currentIndex = state.order.indexOf(id);
          if (currentIndex === -1) return state;

          const newOrder = [...state.order];
          const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

          // Bounds check
          if (targetIndex < 0 || targetIndex >= newOrder.length) return state;

          // Swap
          [newOrder[currentIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[currentIndex]];

          return { order: newOrder };
        }),

      toggleVisibility: (id) =>
        set((state) => ({
          hidden: state.hidden.includes(id)
            ? state.hidden.filter((w) => w !== id)
            : [...state.hidden, id],
        })),

      // Logic to reset to default
      resetLayout: () => set({ order: DEFAULT_WIDGETS, hidden: [] }),

      // Logic to auto-add new features
      ensureWidgetsExist: (ids) =>
        set((state) => {
          const missing = ids.filter((id) => !state.order.includes(id));
          if (missing.length === 0) return state;
          // Add missing widgets to the top
          return { order: [...missing, ...state.order] };
        }),
    }),
    {
      name: 'sakina-widget-store-v2', // New version string to reset old cache
    }
  )
);