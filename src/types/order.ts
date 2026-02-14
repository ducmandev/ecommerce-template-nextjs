export type Order = {
  orderId: string;
  createdAt: string;
  status: "delivered" | "on-hold" | "processing" | string;
  total: string;
  title: string;
};

