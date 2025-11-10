import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.product._id === item.product._id);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) =>
        get().items.some((item) => item.product._id === productId),
    }),
    {
      name: 'shoppa-wishlist-storage',
    }
  )
);
