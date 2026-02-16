"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xử lý thanh toán...");

  useEffect(() => {
    const method = searchParams.get("method");
    const orderID = searchParams.get("orderID");
    const payPalOrderId = searchParams.get("payPalOrderId");

    if (method !== "paypal") {
      setStatus("error");
      setMessage("Phương thức thanh toán không hợp lệ.");
      return;
    }

    const ourOrderId =
      (typeof window !== "undefined" ? sessionStorage.getItem("paypalPendingOrderId") : null) ||
      payPalOrderId;
    const payPalOrderIdForCapture =
      (typeof window !== "undefined" ? sessionStorage.getItem("paypalOrderIdFromCreate") : null) ||
      orderID ||
      payPalOrderId;

    if (!ourOrderId || !payPalOrderIdForCapture) {
      setStatus("error");
      setMessage("Thiếu thông tin thanh toán. Vui lòng thử lại từ trang checkout.");
      return;
    }

    const capture = async () => {
      try {
        const res = await fetch("/api/orders/capture-paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: ourOrderId,
            payPalOrderId: payPalOrderIdForCapture,
          }),
        });
        const data = await res.json();

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("paypalPendingOrderId");
          sessionStorage.removeItem("paypalOrderIdFromCreate");
        }

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Thanh toán thất bại.");
          if (window.opener) {
            window.opener.postMessage({ type: "PAYPAL_CANCEL" }, window.location.origin);
            window.close();
          }
          return;
        }

        setStatus("success");
        setMessage("Thanh toán thành công. Đang đóng cửa sổ...");
        const transactionId = data.transactionId || payPalOrderIdForCapture;
        if (window.opener) {
          window.opener.postMessage(
            { type: "PAYPAL_SUCCESS", orderId: ourOrderId, transactionId },
            window.location.origin
          );
          window.close();
        } else {
          window.location.href = `/order-success?orderId=${encodeURIComponent(ourOrderId)}&transactionId=${encodeURIComponent(transactionId)}`;
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        if (window.opener) {
          window.opener.postMessage({ type: "PAYPAL_CANCEL" }, window.location.origin);
          window.close();
        }
      }
    };

    capture();
  }, [searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white shadow-1 rounded-[10px] p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue mx-auto mb-6" />
            <p className="text-dark font-medium">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-dark font-medium">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-14 h-14 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-dark font-medium mb-4">{message}</p>
            {!window.opener && (
              <a
                href="/checkout"
                className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md hover:bg-blue-dark"
              >
                Quay lại Checkout
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
