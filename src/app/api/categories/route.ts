import { NextRequest, NextResponse } from "next/server";

const getBaseUrl = () => {
  const base = process.env.API_BASE_URL;
  return base.replace(/\/$/, "");
};

export async function GET(request: NextRequest) {
  try {
    // Gọi API backend: GET {API_BASE_URL}/categories
    const url = `${getBaseUrl()}/categories`;

    console.log("[/api/categories] Fetching from:", url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache 5 phút
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { message: "Failed to fetch categories", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch categories",
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : String(error),
      },
      { status: 502 }
    );
  }
}
