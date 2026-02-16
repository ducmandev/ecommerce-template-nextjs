"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";

type OrderItem = {
  productId: string;
  variantId: string;
  title: string;
  sku: string;
  thumbnailUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type TimelineItem = {
  status: string;
  label: string;
  at: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  timeline: TimelineItem[];
  notes: string;
};

type OrderResponse = {
  order: Order;
};

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, { name: string; icon: string }> = {
    paypal: { name: "PayPal", icon: "💳" },
    bank: { name: "Bank Transfer", icon: "🏦" },
    cash: { name: "Cash on Delivery", icon: "💵" },
  };
  return labels[method] || { name: method, icon: "💳" };
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "text-yellow-600" },
    processing: { label: "Processing", color: "text-blue-600" },
    shipped: { label: "Shipped", color: "text-purple-600" },
    delivered: { label: "Delivered", color: "text-green-600" },
    cancelled: { label: "Cancelled", color: "text-red-600" },
  };
  return labels[status] || { label: status, color: "text-dark" };
};

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "text-yellow-600" },
    paid: { label: "Paid", color: "text-green-600" },
    failed: { label: "Failed", color: "text-red-600" },
    refunded: { label: "Refunded", color: "text-orange-600" },
  };
  return labels[status] || { label: status, color: "text-dark" };
};

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data: OrderResponse = await res.json();
        if (!res.ok) {
          throw new Error((data as any).error || "Failed to fetch order");
        }
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Breadcrumb title={"Order Success"} pages={["Order Success"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue border-t-transparent" />
                <p className="text-dark font-medium">Đang tải thông tin đơn hàng...</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Breadcrumb title={"Order Error"} pages={["Order Error"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
              <div className="w-14 h-14 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="font-semibold text-xl text-dark mb-2">Không tìm thấy đơn hàng</h2>
              <p className="text-dark-4 mb-6">{error || "Đơn hàng không tồn tại hoặc đã bị xóa."}</p>
              <a
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md hover:bg-blue-dark"
              >
                Tiếp tục mua sắm
              </a>
            </div>
          </div>
        </section>
      </>
    );
  }

  const paymentMethodInfo = getPaymentMethodLabel(order.paymentMethod);
  const statusInfo = getStatusLabel(order.status);
  const paymentStatusInfo = getPaymentStatusLabel(order.paymentStatus);

  return (
    <>
      <Breadcrumb title={"Order Success"} pages={["Order Success"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Success Header */}
          <div className="bg-white shadow-1 rounded-[10px] p-6 sm:p-8 mb-7.5 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-semibold text-2xl sm:text-3xl text-dark mb-2">
              The order has been placed successfully!
            </h1>
            <p className="text-dark-4 mb-4">
              ...
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/10 rounded-lg">
              <span className="font-medium text-blue">Order code:</span>
              <span className="font-semibold text-dark">{order.id}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
            {/* Left: Order Details */}
            <div className="lg:max-w-[670px] w-full space-y-7.5">
              {/* Order Review */}
              <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                <h3 className="font-medium text-xl text-dark mb-6">Order Review</h3>

                {/* Order Status & Payment Status */}
                <div className="mb-6 pb-6 border-b border-gray-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-dark mb-2">Order Status</h4>
                      <span className={`inline-block px-3 py-1 rounded-md font-medium ${statusInfo.color} bg-gray-1`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-dark mb-2">Payment Status</h4>
                      <span className={`inline-block px-3 py-1 rounded-md font-medium ${paymentStatusInfo.color} bg-gray-1`}>
                        {paymentStatusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="mb-6 pb-6 border-b border-gray-3">
                  <h4 className="font-medium text-dark mb-3">Shipping Information</h4>
                  <div className="bg-gray-1 p-4 rounded-lg">
                    <p className="font-medium text-dark mb-1">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-dark-4 mb-1">{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && (
                      <p className="text-sm text-dark-4 mb-1">{order.shippingAddress.line2}</p>
                    )}
                    <p className="text-sm text-dark-4 mb-1">
                      {order.shippingAddress.city}
                      {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                      {order.shippingAddress.postalCode && ` ${order.shippingAddress.postalCode}`}
                    </p>
                    <p className="text-sm text-dark-4 mb-1">{order.shippingAddress.country}</p>
                    <p className="text-sm text-dark-4">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="mb-6 pb-6 border-b border-gray-3">
                  <h4 className="font-medium text-dark mb-3">Billing Information</h4>
                  <div className="bg-gray-1 p-4 rounded-lg">
                    <p className="font-medium text-dark mb-1">{order.billingAddress.fullName}</p>
                    <p className="text-sm text-dark-4 mb-1">{order.billingAddress.line1}</p>
                    {order.billingAddress.line2 && (
                      <p className="text-sm text-dark-4 mb-1">{order.billingAddress.line2}</p>
                    )}
                    <p className="text-sm text-dark-4 mb-1">
                      {order.billingAddress.city}
                      {order.billingAddress.state && `, ${order.billingAddress.state}`}
                      {order.billingAddress.postalCode && ` ${order.billingAddress.postalCode}`}
                    </p>
                    <p className="text-sm text-dark-4 mb-1">{order.billingAddress.country}</p>
                    <p className="text-sm text-dark-4">Phone: {order.billingAddress.phone}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 pb-6 border-b border-gray-3">
                  <h4 className="font-medium text-dark mb-3">Payment Method</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-2 rounded-lg flex items-center justify-center text-2xl">
                      {paymentMethodInfo.icon}
                    </div>
                    <div>
                      <p className="font-medium text-dark">{paymentMethodInfo.name}</p>
                      <p className="text-sm text-dark-4">
                        {order.paymentMethod === "cash"
                          ? "Pay when you receive your order"
                          : order.paymentStatus === "paid"
                            ? "Payment completed"
                            : "Payment pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-medium text-dark mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-1 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-2 rounded overflow-hidden">
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-dark font-medium line-clamp-2">{item.title}</p>
                            <p className="text-xs text-dark-4">SKU: {item.sku}</p>
                            <p className="text-sm text-dark-4">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-dark ml-4">
                          ${item.lineTotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Timeline */}
                {order.timeline && order.timeline.length > 0 && (
                  <div>
                    <h4 className="font-medium text-dark mb-3">Order Timeline</h4>
                    <div className="space-y-3">
                      {order.timeline.map((timeline, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-1 rounded-lg">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue mt-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-dark">{timeline.label}</p>
                            <p className="text-xs text-dark-4">
                              {new Date(timeline.at).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                {/* <a
                  href="/shop-with-sidebar"
                  className="flex items-center justify-center font-medium text-dark bg-white border border-gray-3 py-3 px-8 rounded-md ease-out duration-200 hover:bg-gray-2"
                >
                  Continue shopping
                </a> */}
                <a
                  href="/shop-with-sidebar"
                  className="flex items-center justify-center font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark"
                >
                  Continue shopping
                </a>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="max-w-[455px] w-full">
              <div className="bg-white shadow-1 rounded-[10px] sticky top-24">
                <div className="py-6 px-6">
                  <h3 className="font-semibold text-2xl text-dark mb-1">Order Summary</h3>
                  <p className="text-sm text-dark-4">({order.items.length} items)</p>
                </div>

                <div className="px-6 pb-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {order.items.map((item, key) => (
                      <div key={key} className="flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-2 rounded-lg overflow-hidden">
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-dark font-medium mb-1 line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-dark-4 mb-1">SKU: {item.sku}</p>
                          <p className="text-sm text-dark-4">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-dark mt-1">
                            ${item.unitPrice.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t border-gray-3 pt-4 space-y-2">
                    <div className="flex justify-between text-dark">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.shippingFee > 0 && (
                      <div className="flex justify-between text-dark">
                        <span>Shipping</span>
                        <span>${order.shippingFee.toFixed(2)}</span>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg text-dark pt-2 border-t border-gray-3">
                      <span>Total</span>
                      <span>
                        {order.currency} ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="mt-6 pt-6 border-t border-gray-3">
                      <h4 className="font-medium text-dark mb-2">Order Notes</h4>
                      <p className="text-sm text-dark-4">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
