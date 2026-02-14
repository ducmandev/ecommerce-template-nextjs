import { NextResponse } from "next/server";
import ordersData from "@/components/Orders/ordersData";
// Nếu sau này có backend thật, bạn import serverHttp từ "@/lib/http/axios-server"
// và gọi serverHttp.get("/orders") thay cho mock.

export async function GET() {
  try {
    // Ví dụ proxy backend thật:
    // const res = await serverHttp.get("/orders");
    // return NextResponse.json({ orders: res.data });

    // Hiện tại dùng mock từ ordersData để đồng bộ UI
    return NextResponse.json({ orders: ordersData });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

