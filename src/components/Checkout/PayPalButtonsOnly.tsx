'use client';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface PayPalButtonsOnlyProps {
  orderId: string;
  amount: number;
  onSuccess: (details: any) => void;
}

export default function PayPalButtonsOnly({ orderId, amount, onSuccess }: PayPalButtonsOnlyProps) {
  const [{ isResolved, isPending, isRejected }] = usePayPalScriptReducer();

  console.log('PayPalButtonsOnly render state:', { isResolved, isPending, isRejected });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
        <p className="ml-4 text-dark-4">Loading PayPal SDK...</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="p-4 bg-red/10 border border-red/20 rounded-lg">
        <p className="text-sm text-red font-medium mb-1">Failed to load PayPal SDK</p>
        <p className="text-xs text-dark-4 mb-3">
          The PayPal script could not be loaded. Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs bg-red text-white px-4 py-2 rounded hover:bg-red/90"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!isResolved) {
    return null;
  }

  // SDK is ready, render buttons
  console.log('✅ Rendering PayPal Buttons');

  return (
    <PayPalButtons
      style={{ layout: 'vertical', color: 'gold', label: 'paypal' }}
      
      createOrder={async () => {
        try {
          console.log('Creating PayPal order for:', orderId);
          const res = await fetch('/api/orders/create-paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, amount }),
          });
          const data = await res.json();
          console.log('PayPal order created:', data.paypalOrderId);
          return data.paypalOrderId;
        } catch (error) {
          console.error('Create order error:', error);
          throw error;
        }
      }}
      
      onApprove={async (data) => {
        try {
          console.log('Payment approved, capturing:', data.orderID);
          const res = await fetch('/api/orders/capture-paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
          });
          const result = await res.json();
          console.log('Payment captured:', result);
          onSuccess(result);
        } catch (error) {
          console.error('Capture error:', error);
          alert('Payment failed. Please try again.');
        }
      }}
      
      onError={(err) => {
        console.error('PayPal error:', err);
        alert('PayPal error occurred. Please try again.');
      }}
      
      onCancel={() => {
        console.log('Payment cancelled by user');
      }}
    />
  );
}
