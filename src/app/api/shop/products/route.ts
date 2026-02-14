import { NextRequest, NextResponse } from "next/server";

const getBaseUrl = () => {
  const base = process.env.API_BASE_URL;
  console.log("[/api/shop/products] API_BASE_URL =", base);
  return base.replace(/\/$/, "");
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build query params for backend API
    const params = new URLSearchParams();
    
    // Required params
    const page = searchParams.get("Page") ?? searchParams.get("page") ?? "1";
    const limit = searchParams.get("Limit") ?? searchParams.get("limit") ?? "9";
    params.append("Page", page);
    params.append("Limit", limit);
    
    // Optional filter params
    const category = searchParams.get("Category") ?? searchParams.get("category");
    const brand = searchParams.get("Brand") ?? searchParams.get("brand");
    const color = searchParams.get("Color") ?? searchParams.get("color");
    const size = searchParams.get("Size") ?? searchParams.get("size");
    const minPrice = searchParams.get("MinPrice") ?? searchParams.get("minPrice");
    const maxPrice = searchParams.get("MaxPrice") ?? searchParams.get("maxPrice");
    const sort = searchParams.get("Sort") ?? searchParams.get("sort");
    
    if (category) params.append("Category", category);
    if (brand) params.append("Brand", brand);
    if (color) params.append("Color", color);
    if (size) params.append("Size", size);
    if (minPrice) params.append("MinPrice", minPrice);
    if (maxPrice) params.append("MaxPrice", maxPrice);
    if (sort) params.append("Sort", sort);

    const url = `${getBaseUrl()}/products?${params.toString()}`;

    console.log("[/api/shop/products] Forwarding to:", url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        {
          message: "Failed to fetch products",
          status: res.status,
          body: text,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/shop/products error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch products",
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : String(error),
      },
      { status: 502 }
    );
  }
}
