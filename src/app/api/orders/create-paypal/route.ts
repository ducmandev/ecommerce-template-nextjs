import { NextRequest, NextResponse } from 'next/server';

// Mock API to create PayPal order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;
    
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Mock PayPal order ID
    const paypalOrderId = `PAYPAL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    console.log('Creating PayPal order:', {
      orderId,
      amount,
      paypalOrderId,
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, you would call PayPal API here
    // const paypalOrder = await createPayPalOrder(amount, orderId);
    
    return NextResponse.json({
      paypalOrderId,
      status: 'created',
    });
  } catch (error: any) {
    console.error('Create PayPal order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
