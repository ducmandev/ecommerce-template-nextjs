import { api } from "./api";
import type { Order } from "@/types/order";

type OrdersResponse = {
  orders: Order[];
};

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => "orders",
      transformResponse: (response: OrdersResponse) => response.orders,
      providesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery } = ordersApi;

