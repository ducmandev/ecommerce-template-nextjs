import { NextRequest, NextResponse } from 'next/server';

// Mock API to create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate mock order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    console.log('Creating order:', {
      orderId,
      ...body,
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return NextResponse.json({
      orderId,
      status: 'pending',
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
