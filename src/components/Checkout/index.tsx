"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Breadcrumb from "../Common/Breadcrumb";
import StepIndicator from "./StepIndicator";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import PayPalButtonsOnly from "./PayPalButtonsOnly";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice, removeAllItemsFromCart } from "@/redux/features/cart-slice";

const SHIPPING_FEE = 15.0;

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const subtotal = useSelector(selectTotalPrice);
  const total = subtotal /* + SHIPPING_FEE */;

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  
  // PayPal integration
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form validation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Australia",
    address: "",
    addressTwo: "",
    town: "",
    phone: "",
    email: "",
    shippingMethod: "free",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showErrors, setShowErrors] = useState(false);

  const steps = [
    { number: 1, title: "SHIPPING & PAYMENT METHOD" },
    { number: 2, title: "COMPLETE PAYMENT" },
    { number: 3, title: "REVIEW ORDER" },
  ];

  // Validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Required fields
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.address.trim()) {
      errors.address = "Street address is required";
    }
    if (!formData.town.trim()) {
      errors.town = "Town/City is required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

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

      // Auto move to Step 2 after order created (for PayPal and Bank)
      if (paymentMethod === 'paypal' || paymentMethod === 'bank') {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = useCallback((details: any) => {
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
  }, [dispatch, orderId, router]);

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
                {/* Step 1: Shipping Information + Payment Method Selection */}
                {currentStep === 1 && (
                  <div className="space-y-7.5">
                    {/* Error Summary */}
                    {showErrors && Object.keys(formErrors).length > 0 && (
                      <div className="bg-red/10 border border-red/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-red rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red mb-1">
                              Please fix the following errors:
                            </p>
                            <ul className="text-sm text-red space-y-1">
                              {Object.entries(formErrors).map(([field, error]) => (
                                <li key={field}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Login />
                    
                    {/* Billing details with validation */}
                    <div className="mt-9">
                      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
                        Billing details
                      </h2>

                      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                          <div className="w-full">
                            <label htmlFor="firstName" className="block mb-2.5">
                              First Name <span className="text-red">*</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John"
                              className={`rounded-md border ${
                                showErrors && formErrors.firstName ? 'border-red' : 'border-gray-3'
                              } bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
                                showErrors && formErrors.firstName ? 'focus:ring-red/20' : 'focus:ring-blue/20'
                              }`}
                            />
                            {showErrors && formErrors.firstName && (
                              <p className="text-red text-sm mt-1">{formErrors.firstName}</p>
                            )}
                          </div>

                          <div className="w-full">
                            <label htmlFor="lastName" className="block mb-2.5">
                              Last Name <span className="text-red">*</span>
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Doe"
                              className={`rounded-md border ${
                                showErrors && formErrors.lastName ? 'border-red' : 'border-gray-3'
                              } bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
                                showErrors && formErrors.lastName ? 'focus:ring-red/20' : 'focus:ring-blue/20'
                              }`}
                            />
                            {showErrors && formErrors.lastName && (
                              <p className="text-red text-sm mt-1">{formErrors.lastName}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-5">
                          <label htmlFor="companyName" className="block mb-2.5">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            id="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                          />
                        </div>



                        <div className="mb-5">
                          <label htmlFor="address" className="block mb-2.5">
                            Street Address <span className="text-red">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="House number and street name"
                            className={`rounded-md border ${
                              showErrors && formErrors.address ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
                              showErrors && formErrors.address ? 'focus:ring-red/20' : 'focus:ring-blue/20'
                            }`}
                          />
                          {showErrors && formErrors.address && (
                            <p className="text-red text-sm mt-1">{formErrors.address}</p>
                          )}

                          <div className="mt-5">
                            <input
                              type="text"
                              name="addressTwo"
                              id="addressTwo"
                              value={formData.addressTwo}
                              onChange={handleInputChange}
                              placeholder="Apartment, suite, unit, etc. (optional)"
                              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            />
                          </div>
                        </div>

                        <div className="mb-5">
                          <label htmlFor="town" className="block mb-2.5">
                            Town/ City <span className="text-red">*</span>
                          </label>
                          <input
                            type="text"
                            name="town"
                            id="town"
                            value={formData.town}
                            onChange={handleInputChange}
                            className={`rounded-md border ${
                              showErrors && formErrors.town ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
                              showErrors && formErrors.town ? 'focus:ring-red/20' : 'focus:ring-blue/20'
                            }`}
                          />
                          {showErrors && formErrors.town && (
                            <p className="text-red text-sm mt-1">{formErrors.town}</p>
                          )}
                        </div>

                        <div className="mb-5">
                          <label htmlFor="phone" className="block mb-2.5">
                            Phone <span className="text-red">*</span>
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 234 567 8900"
                            className={`rounded-md border ${
                              showErrors && formErrors.phone ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
                              showErrors && formErrors.phone ? 'focus:ring-red/20' : 'focus:ring-blue/20'
                            }`}
                          />
                          {showErrors && formErrors.phone && (
                            <p className="text-red text-sm mt-1">{formErrors.phone}</p>
                          )}
                        </div>

                        <div className="mb-5.5">
                          <label htmlFor="email" className="block mb-2.5">
                            Email Address <span className="text-red">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@email.com"
                            className={`rounded-md border ${
                              showErrors && formErrors.email ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
                              showErrors && formErrors.email ? 'focus:ring-red/20' : 'focus:ring-blue/20'
                            }`}
                          />
                          {showErrors && formErrors.email && (
                            <p className="text-red text-sm mt-1">{formErrors.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <PaymentMethod selected={paymentMethod} onChange={setPaymentMethod} />

                    {/* Order Notes */}
                    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                      <label htmlFor="notes" className="block mb-2.5 font-medium text-dark">
                        Other Notes (optional)
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={5}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Notes about your order, e.g. special notes for delivery."
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          // Validate form first
                          setShowErrors(true);
                          if (!validateForm()) {
                            // Scroll to first error
                            const firstErrorField = Object.keys(formErrors)[0];
                            const element = document.getElementById(firstErrorField);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              element.focus();
                            }
                            return;
                          }

                          if (paymentMethod === 'cash') {
                            // Cash goes to step 3 for review
                            setCurrentStep(3);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else {
                            // Bank/PayPal need to create order first
                            handleCheckout();
                          }
                        }}
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
                        ) : (
                          <>
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
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Complete Payment */}
                {currentStep === 2 && (
                  <div className="space-y-7.5">
                    {/* PayPal Payment - Load Provider ONLY when needed */}
                    {paymentMethod === 'paypal' && (
                      <PayPalScriptProvider
                        options={{
                          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                          currency: 'USD',
                          intent: 'capture',
                          components: 'buttons',
                        }}
                      >
                        <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                          <h3 className="font-semibold text-2xl text-dark mb-6">
                            Complete PayPal Payment
                          </h3>
                          
                          <div className="mb-4 p-4 bg-blue/5 border border-blue/20 rounded-lg">
                            <p className="text-sm text-dark font-medium mb-1">
                              Complete your payment with PayPal
                            </p>
                            <p className="text-xs text-dark-4">
                              Click the PayPal button below to securely complete your purchase.
                            </p>
                          </div>

                          <PayPalButtonsOnly
                            orderId={orderId}
                            amount={total}
                            onSuccess={handlePayPalSuccess}
                          />

                          {/* Back button */}
                          <button
                            type="button"
                            onClick={() => {
                              setOrderCreated(false);
                              setOrderId('');
                              setCurrentStep(1);
                            }}
                            className="w-full flex justify-center items-center font-medium text-dark bg-white border border-gray-3 py-3 px-6 rounded-md ease-out duration-200 hover:bg-gray-2 mt-4"
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
                            ← Back to Shipping
                          </button>
                        </div>
                      </PayPalScriptProvider>
                    )}

                    {/* Bank Transfer Payment */}
                    {paymentMethod === 'bank' && (
                      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                        <h3 className="font-semibold text-2xl text-dark mb-6">
                          Bank Transfer Details
                        </h3>

                        <div className="p-4 bg-green/10 border border-green/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-green rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
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
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-green mb-1">
                                Bank Transfer Details
                              </p>
                              <p className="text-xs text-dark-4 mb-3">
                                Please transfer the amount to the following account:
                              </p>
                              <div className="bg-white p-3 rounded border border-gray-3 text-xs space-y-1">
                                <p><span className="font-medium">Bank Name:</span> Example Bank</p>
                                <p><span className="font-medium">Account Number:</span> 1234567890</p>
                                <p><span className="font-medium">Account Name:</span> Your Company Name</p>
                                <p><span className="font-medium">Amount:</span> ${(total + total * 0.1).toFixed(2)}</p>
                                <p><span className="font-medium">Reference:</span> {orderId}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Confirm button */}
                        <button
                          type="button"
                          onClick={() => {
                            console.log('=== BANK TRANSFER CONFIRMED (TEST MODE) ===');
                            console.log('Payment Method: Bank Transfer');
                            console.log('Order ID:', orderId);
                            console.log('Total Amount:', (total + total * 0.1).toFixed(2));
                            console.log('Cart Items:', cartItems);
                            console.log('Would redirect to:', `/order-success?orderId=${orderId}`);
                            console.log('Cart cleared:', 'YES');
                            console.log('===========================================');
                            
                            dispatch(removeAllItemsFromCart());
                            // COMMENTED FOR TESTING: router.push(`/order-success?orderId=${orderId}`);
                            alert(`✅ Bank Transfer Confirmed!\n\nOrder ID: ${orderId}\nAmount: $${(total + total * 0.1).toFixed(2)}\n\nCheck console for details.\n\n(Redirect disabled for testing)`);
                          }}
                          className="w-full flex justify-center items-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-4"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          I&apos;ve Made the Transfer
                        </button>

                        {/* Back button */}
                        <button
                          type="button"
                          onClick={() => {
                            setOrderCreated(false);
                            setOrderId('');
                            setCurrentStep(1);
                          }}
                          className="w-full flex justify-center items-center font-medium text-dark bg-white border border-gray-3 py-3 px-6 rounded-md ease-out duration-200 hover:bg-gray-2 mt-4"
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
                          ← Back to Shipping
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Review Order (Cash on Delivery only) */}
                {currentStep === 3 && (
                  <div className="space-y-7.5">
                    {/* Order Review */}
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
                            💵
                          </div>
                          <div>
                            <p className="font-medium text-dark">Cash on Delivery</p>
                            <p className="text-sm text-dark-4">
                              Pay when you receive your order
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
                        Back to Info
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          console.log('=== ORDER SUCCESS (TEST MODE) ===');
                          console.log('Payment Method:', paymentMethod);
                          console.log('Order ID: (will be created)');
                          console.log('Total:', total);
                          console.log('Cart Items:', cartItems);
                          console.log('Would redirect to:', `/order-success`);
                          console.log('Cart cleared:', 'YES');
                          console.log('=================================');
                          
                          dispatch(removeAllItemsFromCart());
                          // COMMENTED FOR TESTING: Create order then redirect
                          alert(`✅ Cash Order Confirmed!\n\nCheck console for details.\n\n(Redirect disabled for testing)`);
                        }}
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
                      {/* <div className="flex items-center justify-between text-dark-4">
                        <p>Shipping</p>
                        <p className="font-medium">
                          {SHIPPING_FEE > 0 ? (
                            `$${SHIPPING_FEE.toFixed(2)}`
                          ) : (
                            <span className="text-green">Free</span>
                          )}
                        </p>
                      </div> */}

                      {/* Tax */}
                      {/* <div className="flex items-center justify-between text-dark-4">
                        <p>Tax</p>
                        <p className="font-medium">${(total * 0.1).toFixed(2)}</p>
                      </div> */}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-3 mt-4 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-dark">Total</p>
                        <p className="text-2xl font-bold text-red">
                          ${(total).toFixed(2)}
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
