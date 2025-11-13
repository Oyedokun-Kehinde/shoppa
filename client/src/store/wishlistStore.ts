import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'shoppa-wishlist-storage',
    }
  )
);
