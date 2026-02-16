import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  items: WishListItem[];
};

export type WishListItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  status?: string;
  slug?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

// Load wishlist from localStorage (client-only; use for hydration)
export const loadWishlistFromStorage = (): WishListItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch (error) {
    console.error("Failed to load wishlist from localStorage:", error);
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (items: WishListItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("wishlist", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save wishlist to localStorage:", error);
  }
};

// Always start with empty to avoid SSR/hydration mismatch; hydrate on client
const initialState: InitialState = {
  items: [],
};

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const { id, title, price, quantity, imgs, discountedPrice, status, slug } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity,
          imgs,
          discountedPrice,
          status,
          slug,
        });
      }
      
      // Save to localStorage
      saveWishlistToStorage(state.items);
    },
    removeItemFromWishlist: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      
      // Save to localStorage
      saveWishlistToStorage(state.items);
    },

    removeAllItemsFromWishlist: (state) => {
      state.items = [];
      
      // Save to localStorage
      saveWishlistToStorage(state.items);
    },

    // Hydrate wishlist from localStorage (dispatch with payload from client useEffect)
    setWishlistFromStorage: (state, action: PayloadAction<WishListItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
  setWishlistFromStorage,
} = wishlist.actions;
export default wishlist.reducer;
