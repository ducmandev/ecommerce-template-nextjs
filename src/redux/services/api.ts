import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// RTK Query base cho mô hình B (BFF):
// Client chỉ gọi route handler nội bộ Next tại /api/*
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      // Nếu sau này bạn dùng access token ở client:
      // const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      // if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Orders", "Products"],
  endpoints: () => ({}),
});

