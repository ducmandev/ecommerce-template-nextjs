# API Flow & Hướng dẫn tích hợp API mới (RTK Query + Next App Router + Axios BFF)

## 1. Kiến trúc tổng quan

- **Client (React component)**  
  - Dùng **RTK Query hooks** (`useXxxQuery`, `useXxxMutation`) để call API.  
  - Không gọi backend trực tiếp, chỉ gọi các endpoint dưới `/api/*`.

- **RTK Query layer (`src/redux/services`)**  
  - File gốc: `src/redux/services/api.ts`  
    - `baseUrl: "/api"` → mọi `query: () => "orders"` thực chất là call `/api/orders`.  
    - `credentials: "include"` để gửi cookie cùng request.  
  - Mỗi domain (orders, products, auth, …) tạo một file `xxxApi.ts` và `injectEndpoints` từ `api`.

- **Next Route Handlers (`src/app/api/**/route.ts`) – BFF Layer**  
  - Nhận request từ client (`/api/...`) → xử lý logic server-side.  
  - Có thể:
    - Trả **mock** data (development).  
    - Hoặc proxy sang backend thật bằng **Axios server** (`src/lib/http/axios-server.ts`).

- **Axios server (`src/lib/http/axios-server.ts`) – gọi backend thật**  
  - `baseURL = process.env.API_BASE_URL` (backend URL).  
  - Được dùng **trong route handler** để call backend (nếu có).

Flow chuẩn khi call API:

1. Component → gọi `useXxxQuery()` / `useXxxMutation()`  
2. RTK Query → `fetchBaseQuery` → request tới `/api/...`  
3. Next Route Handler `/api/...` → (tuỳ lựa chọn)  
   - Trả mock data, **hoặc**  
   - Gọi `serverHttp` (Axios) tới backend thật  
4. Route handler trả JSON → RTK Query nhận response → trả data cho component.

---

## 2. Các file quan trọng hiện có

- **RTK Query base**: `src/redux/services/api.ts`
- **Orders API**: `src/redux/services/ordersApi.ts`
  - Endpoint: `getOrders` → `GET /api/orders`
- **Route handler Orders**: `src/app/api/orders/route.ts`
  - Hiện đang trả mock `ordersData`.
- **Axios client (nếu cần)**: `src/lib/http/axios-client.ts`
- **Axios server (proxy backend)**: `src/lib/http/axios-server.ts`
- **Kiểu dữ liệu Order**: `src/types/order.ts`

---

## 3. Checklist tạo API mới (Query – GET)

Giả sử muốn thêm API mới: `GET /api/products`

### Bước 1: Tạo route handler `/api/products`

Tạo file: `src/app/api/products/route.ts`  
Ví dụ (mock hoặc proxy backend):

```ts
import { NextResponse } from "next/server";
// import { serverHttp } from "@/lib/http/axios-server"; // nếu gọi backend thật

export async function GET() {
  try {
    // Ví dụ mock:
    const products = []; // TODO: thay bằng data thật
    // Ví dụ proxy backend:
    // const res = await serverHttp.get("/products");
    // const products = res.data;

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
```

### Bước 2: Định nghĩa type cho dữ liệu

File gợi ý: `src/types/product.ts`

```ts
export type Product = {
  id: number;
  name: string;
  price: number;
  // ... các field khác
};
```

### Bước 3: Tạo service RTK Query cho domain

File mới: `src/redux/services/productsApi.ts`

```ts
import { api } from "./api";
import type { Product } from "@/types/product";

type ProductsResponse = {
  products: Product[];
};

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => "products", // => /api/products
      transformResponse: (response: ProductsResponse) => response.products,
      providesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery } = productsApi;
```

**Lưu ý**: nếu dùng `providesTags: ["Products"]`, hãy thêm `"Products"` vào `tagTypes` ở `api.ts`.

### Bước 4: Dùng hook trong component client

```ts
"use client";

import { useGetProductsQuery } from "@/redux/services/productsApi";

const ProductList = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products</p>;
  if (products.length === 0) return <p>No products</p>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
};

export default ProductList;
```

---

## 4. Checklist tạo API mới (Mutation – POST/PUT/DELETE)

Giả sử muốn thêm **tạo order**: `POST /api/orders`

### Bước 1: Cập nhật route handler `/api/orders`

Trong `src/app/api/orders/route.ts`, thêm:

```ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Ví dụ proxy backend:
    // const res = await serverHttp.post("/orders", body);
    // return NextResponse.json(res.data, { status: 201 });

    // Hoặc xử lý mock:
    return NextResponse.json({ message: "Created (mock)" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
```

### Bước 2: Thêm mutation endpoint trong RTK Query

Trong `src/redux/services/ordersApi.ts`:

```ts
export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => "orders",
      transformResponse: (response: OrdersResponse) => response.orders,
      providesTags: ["Orders"],
    }),
    createOrder: build.mutation<any, Partial<Order>>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = ordersApi;
```

### Bước 3: Dùng mutation hook trong component

```ts
const SomeComponent = () => {
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleCreate = async () => {
    try {
      await createOrder({ title: "New Order" }).unwrap();
      // Orders list sẽ tự refetch nhờ invalidatesTags: ["Orders"]
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      Create order
    </button>
  );
};
```

---

## 5. Checklist nhanh khi tích hợp API mới

1. **Định nghĩa dữ liệu**: tạo/ cập nhật type trong `src/types/*`.  
2. **Tạo route handler** trong `src/app/api/<resource>/route.ts` (GET/POST/PUT/DELETE).  
3. **Nếu có backend thật**: dùng `serverHttp` trong route handler để proxy.  
4. **Thêm endpoint vào RTK Query** thông qua `api.injectEndpoints` trong `src/redux/services/*Api.ts`.  
5. **Dùng hook** (`useXxxQuery` / `useXxxMutation`) trong component client (`"use client"`).  
6. **Quản lý cache**: cấu hình `providesTags` / `invalidatesTags` để tự refetch khi mutate.  
7. (Tuỳ chọn) Tái sử dụng logic ở nhiều component bằng custom hooks wrap quanh hooks của RTK Query.

