import { NextRequest, NextResponse } from "next/server";

const PAYMENT_CAPTURE_ORDER_URL = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL.replace(/\/$/, "")}/payment/capture-order`
  : "https://be.pozzel.xyz/api/payment/capture-order";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, payPalOrderId } = body;

    if (!orderId || !payPalOrderId) {
      return NextResponse.json(
        { error: "Missing orderId or payPalOrderId" },
        { status: 400 }
      );
    }

    const response = await fetch(PAYMENT_CAPTURE_ORDER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({ orderId, payPalOrderId }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Failed to capture payment" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.orderId,
      transactionId: data.transactionId,
      status: data.status ?? "completed",
      message: data.message ?? "Payment captured successfully",
      ...data,
    });
  } catch (error: any) {
    console.error("Capture PayPal payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture payment" },
      { status: 500 }
    );
  }
}
