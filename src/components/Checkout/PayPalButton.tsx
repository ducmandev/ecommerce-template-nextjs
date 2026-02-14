'use client';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  orderId: string;
  amount: number;
  onSuccess: (details: any) => void;
}

// Wrapper component to check if script is loaded
function PayPalButtonWrapper({ orderId, amount, onSuccess }: PayPalButtonProps) {
  const [{ isResolved, isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
        <p className="ml-4 text-dark-4">Loading PayPal...</p>
      </div>
    );
  }

  if (!isResolved) {
    return (
      <div className="p-4 bg-red/10 border border-red/20 rounded-lg">
        <p className="text-sm text-red">Failed to load PayPal SDK. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: 'vertical', color: 'gold' }}
      
      createOrder={async () => {
        // Call your API to create PayPal order
        const res = await fetch('/api/orders/create-paypal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, amount }),
        });
        const data = await res.json();
        return data.paypalOrderId;
      }}
      
      onApprove={async (data) => {
        // Call your API to capture payment
        const res = await fetch('/api/orders/capture-paypal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
        });
        const result = await res.json();
        onSuccess(result);
      }}
      
      onError={(err) => {
        console.error('PayPal error:', err);
        alert('PayPal error occurred. Please try again.');
      }}
    />
  );
}

export default function PayPalButton({ orderId, amount, onSuccess }: PayPalButtonProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'USD',
        intent: 'capture',
        components: 'buttons',
        'enable-funding': 'venmo',
        'disable-funding': 'credit,card',
        'data-sdk-integration-source': 'button-factory',
      }}
      deferLoading={false}
    >
      <PayPalButtonWrapper orderId={orderId} amount={amount} onSuccess={onSuccess} />
    </PayPalScriptProvider>
  );
}
