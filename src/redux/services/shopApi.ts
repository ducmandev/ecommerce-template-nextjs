import { api } from "./api";
import type { Product } from "@/types/product";

/**
 * Response từ API backend.
 * Điều chỉnh type theo đúng response backend nếu khác.
 */
export type ShopProductRaw = {
  id: string | number;
  title?: string;
  name?: string;
  slug?: string;
  handle?: string;
  price?: number;
  discountedPrice?: number;
  salePrice?: number;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  badge?: string | null;
  shortDescription?: string;
  currency?: string;
  [key: string]: unknown;
};

export type ShopProductsResponse = {
  data?: ShopProductRaw[];
  products?: ShopProductRaw[];
  items?: ShopProductRaw[];
  total?: number;
  meta?: { 
    total?: number;
    page?: number;
    limit?: number;
  };
};

const DEFAULT_IMAGE = "https://www.pngplay.com/wp-content/uploads/2/Lamp-Transparent-Free-PNG.png";

/** Map item từ API shop/products sang Product (dùng cho SingleGridItem / SingleListItem). */
export function mapShopProductToProduct(raw: ShopProductRaw): Product {
  const img =
    raw.image ??
    raw.imageUrl ??
    raw.thumbnail ??
    raw.thumbnailUrl ??
    (Array.isArray(raw.images) && raw.images[0]) ??
    DEFAULT_IMAGE;
  const price = Number(raw.price) ?? 0;
  const discountedPrice =
    Number(raw.discountedPrice) ?? Number(raw.salePrice) ?? price;
  return {
    id: typeof raw.id === 'string' ? parseInt(raw.id, 10) : raw.id,
    slug: raw.slug ?? raw.handle ?? String(raw.id),
    title: raw.title ?? raw.name ?? "Product",
    price,
    discountedPrice,
    reviews: raw.reviewCount ?? 0,
    imgs: {
      thumbnails: [img],
      previews: Array.isArray(raw.images) ? raw.images : [img],
    },
  };
}

/** Lấy mảng products từ response (hỗ trợ data / products / items). */
export function getProductsFromResponse(
  res: ShopProductsResponse
): ShopProductRaw[] {
  return res.data ?? res.products ?? res.items ?? [];
}

/** Lấy tổng số từ response. */
export function getTotalFromResponse(res: ShopProductsResponse): number {
  return res.total ?? res.meta?.total ?? 0;
}

// Filter params type for products API
export type ProductFilterParams = {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  name?: string;
};

export const shopApi = api.injectEndpoints({
  endpoints: (build) => ({
    getShopProducts: build.query<ShopProductsResponse, ProductFilterParams>({
      query: ({ page = 1, limit = 9, category, brand, color, size, minPrice, maxPrice, sort, name }) => {
        const params = new URLSearchParams();
        params.append("Page", String(page));
        params.append("Limit", String(limit));
        if (category) params.append("Category", category);
        if (brand) params.append("Brand", brand);
        if (color) params.append("Color", color);
        if (size) params.append("Size", size);
        if (minPrice !== undefined) params.append("MinPrice", String(minPrice));
        if (maxPrice !== undefined) params.append("MaxPrice", String(maxPrice));
        if (sort) params.append("Sort", sort);
        if (name) params.append("Name", name);
        return `shop/products?${params.toString()}`;
      },
    }),
    // New endpoint for products with Page/Limit params (backend format)
    getProducts: build.query<
      ShopProductsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 8 }) =>
        `products?Page=${page}&Limit=${limit}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetShopProductsQuery, useGetProductsQuery } = shopApi;
