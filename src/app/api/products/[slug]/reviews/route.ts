import { NextRequest, NextResponse } from "next/server";

const getBaseUrl = () => {
  const base = process.env.API_BASE_URL;
  return base.replace(/\/$/, "");
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";

    // Gọi API backend: GET {API_BASE_URL}/products/{slug}/reviews
    const url = `${getBaseUrl()}/products/${encodeURIComponent(slug)}/reviews?page=${page}&limit=${limit}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { message: "Failed to fetch reviews", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/products/[slug]/reviews error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch reviews",
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : String(error),
      },
      { status: 502 }
    );
  }
}
