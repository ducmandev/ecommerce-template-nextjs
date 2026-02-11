import { api } from "./api";

// Cấu trúc trả về của Kuzco (rút gọn cho nhu cầu hiện tại)
// Tham khảo JSON: https://kuzcolighting.com/.../products.json
type KuzcoVariant = {
  id: number;
  title: string;
  price: string;
  sku: string;
};

type KuzcoImage = {
  id: number;
  src: string;
};

type KuzcoProduct = {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  variants: KuzcoVariant[];
  images: KuzcoImage[];
};

export type KuzcoProductResponse = {
  products: KuzcoProduct[];
};

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProduct: build.query<KuzcoProductResponse, void>({
      // Gọi tới /api/product (route handler proxy Kuzco)
      query: () => "product",
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductQuery } = productsApi;

