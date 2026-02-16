import React, { useState } from "react";
import Image from "next/image";

interface PaymentMethodProps {
  selected?: string;
  onChange?: (method: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ 
  selected = "paypal",
  onChange 
}) => {
  const [payment, setPayment] = useState(selected);

  const handlePaymentChange = (method: string) => {
    setPayment(method);
    if (onChange) onChange(method);
  };

  const paymentMethods = [
    // {
    //   id: 'bank',
    //   name: 'Direct bank transfer',
    //   icon: '/images/checkout/bank.svg',
    //   iconWidth: 29,
    //   iconHeight: 12,
    // },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '/images/checkout/paypal.svg',
      iconWidth: 75,
      iconHeight: 20,
    },
    {
      id: 'cash',
      name: 'Cash on delivery',
      icon: '/images/checkout/cash.svg',
      iconWidth: 21,
      iconHeight: 21,
    },

  ];

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Select Payment Method</h3>
        <p className="text-sm text-dark-4 mt-1">Choose your preferred payment method</p>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              htmlFor={method.id}
              className={`relative cursor-pointer flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200 ${
                payment === method.id
                  ? 'border-blue bg-blue/5 shadow-md'
                  : 'border-gray-3 hover:border-gray-4 hover:shadow-sm'
              }`}
            >
              <input
                type="radio"
                name="payment"
                id={method.id}
                className="sr-only"
                checked={payment === method.id}
                onChange={() => handlePaymentChange(method.id)}
              />

              {/* Check Icon */}
              {payment === method.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-blue flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Payment Icon */}
              <div className="mb-3 flex items-center justify-center h-12">
                <Image
                  src={method.icon}
                  alt={method.name}
                  width={method.iconWidth}
                  height={method.iconHeight}
                />
              </div>

              {/* Payment Name */}
              <p
                className={`text-sm font-medium text-center ${
                  payment === method.id ? 'text-blue' : 'text-dark'
                }`}
              >
                {method.name}
              </p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
