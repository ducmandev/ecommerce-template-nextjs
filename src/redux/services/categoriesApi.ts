import { api } from "./api";

// Category types
export type Category = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  productCount: number;
};

export type CategoriesResponse = {
  categories: Category[];
};

export const categoriesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<CategoriesResponse, void>({
      query: () => "categories",
    }),
  }),
  overrideExisting: false,
});

export const { useGetCategoriesQuery } = categoriesApi;
