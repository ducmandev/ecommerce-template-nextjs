import { NextRequest, NextResponse } from "next/server";

const PAYMENT_CREATE_ORDER_URL = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL.replace(/\/$/, "")}/payment/create-order`
  : "https://be.pozzel.xyz/api/payment/create-order";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    const response = await fetch(PAYMENT_CREATE_ORDER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Failed to create PayPal order" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      orderId: data.orderId,
      approvalLink: data.approvalLink,
      ...data,
    });
  } catch (error: any) {
    console.error("Create PayPal order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
