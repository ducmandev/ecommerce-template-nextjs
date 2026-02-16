"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { setWishlistFromStorage, loadWishlistFromStorage } from "./features/wishlist-slice";

/**
 * Hydrates Redux wishlist from localStorage on client mount.
 * Fixes SSR where initialState is [] so wishlist shows after load.
 */
export function WishlistHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const items = loadWishlistFromStorage();
    if (items.length > 0) {
      dispatch(setWishlistFromStorage(items));
    }
  }, [dispatch]);

  return <>{children}</>;
}
