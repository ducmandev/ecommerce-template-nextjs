'use client';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  orderId: string;
  amount: number;
  onSuccess: (details: any) => void;
}

export default function PayPalButton({ orderId, amount, onSuccess }: PayPalButtonProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'USD',
      }}
    >
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
      />
    </PayPalScriptProvider>
  );
}
