import { api } from "./api";

// Hero Banner types
export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  ctaLabel: string;
  ctaLink: string;
  imageUrl: string;
  backgroundColor: string;
  textColor: string;
  price: number;
  originalPrice: number;
  currency: string;
};

export type HeroBannersResponse = {
  banners: HeroBanner[];
};

// Countdown Deal types
export type CountdownDealVariant = {
  id: string | null;
  title: string;
  sku: string;
  price: number;
  available: boolean;
  image: string | null;
};

export type CountdownDealProduct = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  price: number;
  discountedPrice: number | null;
  currency: string;
  badge: string | null;
  rating: number;
  reviewCount: number;
  thumbnailUrl: string;
  images: string[];
  variants: CountdownDealVariant[];
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  brand: any | null;
  isBestSeller: boolean;
};

export type CountdownDeal = {
  id: string;
  title: string;
  subtitle: string;
  product: CountdownDealProduct;
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  serverTime: string;
};

export type CountdownDealResponse = {
  deal: CountdownDeal;
};

export const homeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHeroBanners: build.query<HeroBannersResponse, void>({
      query: () => "home/hero",
    }),
    getCountdownDeal: build.query<CountdownDealResponse, void>({
      query: () => "home/countdown-deal",
    }),
  }),
  overrideExisting: false,
});

export const { useGetHeroBannersQuery, useGetCountdownDealQuery } = homeApi;
