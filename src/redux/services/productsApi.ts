import { api } from "./api";

// Cấu trúc trả về chi tiết sản phẩm từ backend 113.161.74.105/api/products/{slug}
export type BackendVariant = {
  id: string | null;
  title: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  attributes?: Record<string, string>;
};

export type BackendCategory = {
  id?: string;
  slug?: string;
  name?: string;
};

export type Brand = {
  id?: string;
  slug?: string;
  name?: string;
};

export type BackendProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  sku: string;
  brand?: Brand;
  category?: BackendCategory[] | null;
  price: number;
  discountedPrice: number | null;
  currency: string;
  badge: string | null;
  rating: number;
  reviewCount: number;
  stockStatus: string;
  stockQuantity: number;
  thumbnails: string[];
  images: string[];
  descriptionHtml: string;
  shortDescription: string;
  specifications?: Record<string, string>;
  variants: BackendVariant[];
  relatedProductIds: string[];
};

export type ProductDetailResponse = {
  product: BackendProduct;
};

// Review types
export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

export type ReviewsResponse = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  reviews: Review[];
};

export type ReviewsParams = {
  slug: string;
  page?: number;
  limit?: number;
};

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProductBySlug: build.query<ProductDetailResponse, string>({
      query: (slug) => `products/${slug}`,
    }),
    getProductReviews: build.query<ReviewsResponse, ReviewsParams>({
      query: ({ slug, page = 1, limit = 10 }) =>
        `products/${slug}/reviews?page=${page}&limit=${limit}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductBySlugQuery, useGetProductReviewsQuery } = productsApi;

