import { clientHttp } from "@/lib/http/axios-client";

export type Order = {
  orderId: string;
  createdAt: string;
  status: "delivered" | "on-hold" | "processing" | string;
  total: string;
  title: string;
};

type OrdersResponse = {
  orders: Order[];
};

export const ordersService = {
  async list(): Promise<Order[]> {
    const res = await clientHttp.get<OrdersResponse>("/api/orders");
    return res.data.orders;
  },
};

