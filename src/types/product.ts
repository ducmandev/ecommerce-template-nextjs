export type Product = {
  slug?: string;
  title: string;
  reviews: number;
  rating?: number; // Star rating (0-5)
  price: number;
  discountedPrice: number;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  badge?: 'NEW' | 'SALE' | string; // Product badge
  category?: string; // Product category
};
