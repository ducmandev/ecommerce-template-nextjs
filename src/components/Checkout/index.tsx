"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Breadcrumb from "../Common/Breadcrumb";
import StepIndicator from "./StepIndicator";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import PayPalButton from "./PayPalButton";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice, removeAllItemsFromCart } from "@/redux/features/cart-slice";

const SHIPPING_FEE = 15.0;

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const subtotal = useSelector(selectTotalPrice);
  const total = subtotal + SHIPPING_FEE;

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  
  // PayPal integration
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { number: 1, title: "SHIPPING ADDRESS" },
    { number: 2, title: "PAYMENT & SHIPPING" },
    { number: 3, title: "REVIEW ORDER" },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in backend
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          items: cartItems.map(item => ({
            productId: item.id,
            title: item.title,
            quantity: item.quantity,
            unitPrice: item.discountedPrice,
          })),
          subtotal,
          shippingFee: SHIPPING_FEE,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderId(data.orderId);
      setOrderCreated(true);

      // If not PayPal, redirect to success immediately
      if (paymentMethod !== 'paypal') {
        dispatch(removeAllItemsFromCart());
        router.push(`/order-success?orderId=${data.orderId}`);
      }
      // If PayPal, buttons will show in Step 2
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = (details: any) => {
    console.log('Payment successful:', details);
    
    // Clear cart
    dispatch(removeAllItemsFromCart());
    
    // Move to Step 3 to show success confirmation
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // After 2 seconds, redirect to success page
    setTimeout(() => {
      router.push(`/order-success?orderId=${orderId}&transactionId=${details.transactionId}`);
    }, 2000);
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} steps={steps} />

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="space-y-7.5">
                    <Login />
                    <Billing />
                    <Shipping />

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center justify-center font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark"
                      >
                        Continue to Payment
                        <svg
                          className="ml-2 w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div className="space-y-7.5">
                    <ShippingMethod />
                    <PaymentMethod selected={paymentMethod} onChange={setPaymentMethod} />
                    
                    {/* <Coupon /> */}

                    {paymentMethod === 'paypal' && orderCreated && (
                      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                        <div className="mb-4 p-4 bg-blue/5 border border-blue/20 rounded-lg">
                          <p className="text-sm text-dark font-medium mb-1">
                            Complete your payment with PayPal
                          </p>
                          <p className="text-xs text-dark-4">
                            Click the PayPal button below to securely complete your purchase.
                          </p>
                        </div>

                        <PayPalButton
                          orderId={orderId}
                          amount={total}
                          onSuccess={handlePayPalSuccess}
                        />

                        {/* Reset button */}
                        <button
                          type="button"
                          onClick={() => {
                            setOrderCreated(false);
                            setOrderId('');
                          }}
                          className="w-full flex justify-center font-medium text-dark bg-white border border-gray-3 py-3 px-6 rounded-md ease-out duration-200 hover:bg-gray-2 mt-4"
                        >
                          ← Change Payment Method
                        </button>
                      </div>
                    )}

                    {/* Order Notes */}
                    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                      <label htmlFor="notes" className="block mb-2.5 font-medium text-dark">
                        Other Notes (optional)
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={5}
                        placeholder="Notes about your order, e.g. special notes for delivery."
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    {/* PayPal Buttons (show if PayPal selected and order created) */}


                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="flex items-center justify-center font-medium text-dark bg-white border border-gray-3 py-3 px-8 rounded-md ease-out duration-200 hover:bg-gray-2"
                      >
                        <svg
                          className="mr-2 w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back to Shipping
                      </button>
                      
                      {/* For PayPal: show Continue button to create order */}
                      {/* For other methods: show Review Order button */}
                      {!orderCreated && (
                        <button
                          type="button"
                          onClick={paymentMethod === 'paypal' ? handleCheckout : handleNext}
                          disabled={isProcessing}
                          className="flex items-center justify-center font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:bg-gray-4 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <>
                              <svg
                                className="animate-spin mr-2 h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Processing...
                            </>
                          ) : paymentMethod === 'paypal' ? (
                            'Continue'
                          ) : (
                            <>
                              Review Order
                              <svg
                                className="ml-2 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-7.5">
                    {/* Success Message (for PayPal after payment) */}
                    {paymentMethod === 'paypal' && (
                      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                        <div className="flex flex-col items-center text-center py-8">
                          {/* Success Icon */}
                          <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-12 h-12 text-green"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>

                          <h3 className="text-2xl font-semibold text-dark mb-2">
                            Payment Successful!
                          </h3>
                          <p className="text-dark-4 mb-4">
                            Your payment has been processed successfully.
                          </p>
                          <p className="text-sm text-dark-4">
                            Order ID: <span className="font-medium text-dark">{orderId}</span>
                          </p>
                          <p className="text-xs text-dark-4 mt-4">
                            Redirecting to confirmation page...
                          </p>

                          {/* Loading spinner */}
                          <div className="mt-6">
                            <svg
                              className="animate-spin h-8 w-8 text-blue mx-auto"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Review (for non-PayPal methods) */}
                    {paymentMethod !== 'paypal' && (
                      <>
                        <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                          <h3 className="font-medium text-xl text-dark mb-6">Order Review</h3>

                          {/* Shipping Info Summary */}
                          <div className="mb-6 pb-6 border-b border-gray-3">
                            <h4 className="font-medium text-dark mb-3">Shipping Information</h4>
                            <p className="text-dark-4 text-sm">
                              All shipping details confirmed
                            </p>
                          </div>

                          {/* Payment Method Summary */}
                          <div className="mb-6 pb-6 border-b border-gray-3">
                            <h4 className="font-medium text-dark mb-3">Payment Method</h4>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-2 rounded-lg flex items-center justify-center text-2xl">
                                {paymentMethod === "bank" && "🏦"}
                                {paymentMethod === "cash" && "💵"}
                              </div>
                              <div>
                                <p className="font-medium text-dark capitalize">{paymentMethod}</p>
                                <p className="text-sm text-dark-4">
                                  {paymentMethod === "bank" && "Direct Bank Transfer"}
                                  {paymentMethod === "cash" && "Cash on Delivery"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium text-dark mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {cartItems.map((item, key) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-3 bg-gray-1 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <p className="text-dark font-medium">{item.title}</p>
                                    {item.variantTitle && (
                                      <p className="text-sm text-dark-4">{item.variantTitle}</p>
                                    )}
                                    <p className="text-sm text-dark-4">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-medium text-dark">
                                    ${(item.discountedPrice * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between gap-4">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="flex items-center justify-center font-medium text-dark bg-white border border-gray-3 py-3 px-8 rounded-md ease-out duration-200 hover:bg-gray-2"
                          >
                            <svg
                              className="mr-2 w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Back to Payment
                          </button>

                          <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0 || isProcessing}
                            className="flex items-center justify-center font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:bg-gray-4 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? (
                              <>
                                <svg
                                  className="animate-spin mr-2 h-5 w-5 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="mr-2 w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Complete Order
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* <!-- checkout right --> Order Summary (Always visible) */}
              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px] sticky top-24">
                  <div className="py-6 px-6">
                    <h3 className="font-semibold text-2xl text-dark mb-1">
                      Your Order
                    </h3>
                    <p className="text-sm text-dark-4">({cartItems.length} items)</p>
                  </div>

                  <div className="px-6 pb-6">
                    {/* Cart Items with Images */}
                    <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                      {cartItems.map((item, key) => (
                        <div key={key} className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-2 rounded-lg overflow-hidden">
                            {item.imgs?.thumbnails?.[0] ? (
                              <Image
                                src={item.imgs.thumbnails[0]}
                                alt={item.title}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-dark-4">
                                <svg
                                  className="w-8 h-8"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-dark font-medium mb-1 line-clamp-2">
                              {item.title}
                            </h4>
                            {item.variantTitle && (
                              <p className="text-xs text-dark-4 mb-1">
                                {item.variantTitle}
                              </p>
                            )}
                            <p className="text-sm text-dark-4">Qty: {item.quantity}</p>
                          </div>

                          {/* Price */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-dark font-semibold">
                              ${(item.discountedPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-3 pt-4 space-y-3">
                      {/* Subtotal */}
                      <div className="flex items-center justify-between text-dark-4">
                        <p>Subtotal</p>
                        <p className="font-medium">${subtotal.toFixed(2)}</p>
                      </div>

                      {/* Shipping */}
                      <div className="flex items-center justify-between text-dark-4">
                        <p>Shipping</p>
                        <p className="font-medium">
                          {SHIPPING_FEE > 0 ? (
                            `$${SHIPPING_FEE.toFixed(2)}`
                          ) : (
                            <span className="text-green">Free</span>
                          )}
                        </p>
                      </div>

                      {/* Tax */}
                      <div className="flex items-center justify-between text-dark-4">
                        <p>Tax</p>
                        <p className="font-medium">${(total * 0.1).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-3 mt-4 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-dark">Total</p>
                        <p className="text-2xl font-bold text-red">
                          ${(total + total * 0.1).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Track Order Notice */}
                    <div className="mt-6 p-4 bg-red/5 rounded-lg border border-red/20">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-red"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red mb-1">
                            TRACK YOUR ORDER
                          </p>
                          <p className="text-xs text-dark-4">
                            Tracking info will be available in your account once shipped.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
