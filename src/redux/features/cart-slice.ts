import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: number;
  /** Tên sản phẩm (product title). */
  title: string;
  /** Tên biến thể / sku title (nếu có). */
  variantTitle?: string;
  /** Giá đang áp dụng cho sku (variant.price). */
  price: number;
  discountedPrice: number;
  quantity: number;
  /** SKU của sản phẩm hoặc biến thể (nếu có). */
  sku?: string;
  /** Product ID từ backend (cho API order). */
  productId?: string;
  /** Variant ID từ backend (cho API order). */
  variantId?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const initialState: InitialState = {
  items: loadCartFromStorage(),
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const {
        id,
        sku,
        title,
        variantTitle,
        price,
        quantity,
        discountedPrice,
        imgs,
        productId,
        variantId,
      } = action.payload;
      const existingItem = state.items.find((item) =>
        sku ? item.sku === sku : item.id === id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          variantTitle,
          price,
          quantity,
          discountedPrice,
          sku,
          imgs,
          productId,
          variantId,
        });
      }
      
      // Save to localStorage
      saveCartToStorage(state.items);
    },
    removeItemFromCart: (
      state,
      action: PayloadAction<{ id: number; sku?: string }>
    ) => {
      const { id, sku } = action.payload;
      state.items = state.items.filter((item) =>
        sku ? item.sku !== sku : item.id !== id
      );
      
      // Save to localStorage
      saveCartToStorage(state.items);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number; sku?: string }>
    ) => {
      const { id, quantity, sku } = action.payload;
      const existingItem = state.items.find((item) =>
        sku ? item.sku === sku : item.id === id
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      }
      
      // Save to localStorage
      saveCartToStorage(state.items);
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      saveCartToStorage(state.items);
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
