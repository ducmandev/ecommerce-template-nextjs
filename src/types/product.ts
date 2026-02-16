export type Product = {
  slug?: string;
  title: string;
  reviews: number;
  rating?: number; // Star rating (0-5)
  price: number;
  discountedPrice: number;
  id: number;
  /** Backend product ID (string) – dùng cho API order. */
  productId?: string;
  /** Backend variant ID (string) – dùng cho API order. */
  variantId?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  badge?: 'NEW' | 'SALE' | string; // Product badge
  category?: string; // Product category
};
