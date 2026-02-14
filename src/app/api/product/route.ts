import { NextResponse } from "next/server";

const KUZCO_PRODUCT_URL =
  "https://kuzcolighting.com/collections/all-products/products.json?id=4572312863038&limit=1&page=1";

export async function GET() {
  try {
    const res = await fetch(KUZCO_PRODUCT_URL, {
      // Có thể điều chỉnh revalidate tuỳ nhu cầu
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch product detail" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/product error:", error);
    return NextResponse.json(
      { message: "Failed to fetch product detail" },
      { status: 500 }
    );
  }
}

