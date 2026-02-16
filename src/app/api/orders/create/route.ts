import { NextRequest, NextResponse } from 'next/server';

const ORDER_API_URL = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL.replace(/\/$/, '')}/orders`
  : 'https://be.pozzel.xyz/api/orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(ORDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || 'Failed to create order' },
        { status: response.status }
      );
    }

    const orderId =
      data.order?.orderId ?? data.orderId ?? data.order?.id ?? data.id ?? data.data?.orderId ?? data.data?.id;
    return NextResponse.json({
      orderId,
      status: data.status ?? data.order?.status ?? "pending",
      message: data.message ?? "Order created successfully",
      order: data.order,
      ...data,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
