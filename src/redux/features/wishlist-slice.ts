import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  items: WishListItem[];
};

type WishListItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  status?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

// Load wishlist from localStorage
const loadWishlistFromStorage = (): WishListItem[] => {
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

const initialState: InitialState = {
  items: loadWishlistFromStorage(),
};

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const { id, title, price, quantity, imgs, discountedPrice, status } =
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
  },
});

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
} = wishlist.actions;
export default wishlist.reducer;
