"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const method = searchParams.get("method");
    if (method === "paypal" && typeof window !== "undefined" && window.opener) {
      window.opener.postMessage({ type: "PAYPAL_CANCEL" }, window.location.origin);
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white shadow-1 rounded-[10px] p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-gray-2 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-dark-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-dark font-medium mb-4">Bạn đã hủy thanh toán.</p>
        <p className="text-sm text-dark-4 mb-6">Đang đóng cửa sổ...</p>
        {typeof window !== "undefined" && !window.opener && (
          <a
            href="/checkout"
            className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md hover:bg-blue-dark"
          >
            Quay lại Checkout
          </a>
        )}
      </div>
    </div>
  );
}
