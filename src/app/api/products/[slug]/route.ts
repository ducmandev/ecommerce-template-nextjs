import { NextRequest, NextResponse } from "next/server";

const getBaseUrl = () => {
  const base = process.env.API_BASE_URL ;
  return base.replace(/\/$/, "");
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Gọi trực tiếp endpoint backend: GET {API_BASE_URL}/products/{slug}
    const url = `${getBaseUrl()}/products/${encodeURIComponent(slug)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { message: "Failed to fetch product", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Nếu backend trả trực tiếp object product -> wrap lại thành { product }
    // Nếu đã là { product } thì giữ nguyên.
    const product = (data as any).product ?? data;

    return NextResponse.json({ product });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch product",
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : String(error),
      },
      { status: 502 }
    );
  }
}
