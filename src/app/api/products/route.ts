import { NextRequest, NextResponse } from "next/server";

const getBaseUrl = () => {
  const base = process.env.API_BASE_URL;
  return base.replace(/\/$/, "");
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("Page") ?? searchParams.get("page") ?? "1";
    const limit = searchParams.get("Limit") ?? searchParams.get("limit") ?? "8";

    // Gọi API backend: GET {API_BASE_URL}/products?Page={page}&Limit={limit}
    const url = `${getBaseUrl()}/products?Page=${page}&Limit=${limit}`;

    console.log("[/api/products] Fetching from:", url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache 1 phút
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { message: "Failed to fetch products", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/products error:", error);
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
