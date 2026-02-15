import { NextResponse } from "next/server";

const getBaseUrl = () => {
  const base = process.env.API_BASE_URL;
  return base?.replace(/\/$/, "");
};

export async function GET() {
  try {
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      return NextResponse.json(
        { message: "API_BASE_URL is not configured" },
        { status: 500 }
      );
    }

    // Backend endpoint: GET {API_BASE_URL}/brands
    const url = `${baseUrl}/brands`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { message: "Failed to fetch brands", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch brands",
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : String(error),
      },
      { status: 502 }
    );
  }
}
