import { api } from "./api";

export type Brand = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  productCount: number;
};

export type BrandsResponse = {
  brands: Brand[];
};

export const brandsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBrands: build.query<BrandsResponse, void>({
      query: () => "brands",
    }),
  }),
  overrideExisting: false,
});

export const { useGetBrandsQuery } = brandsApi;
