"use client";

import React from "react";
import ProductDetail from "@/components/ProductDetail";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  // Lấy slug trực tiếp từ URL params - đơn giản và rõ ràng
  const params = useParams();
  const slug = params.slug as string;

  
  console.log("slug11",slug);
  console.log("params",params);
  return (
    <main>
      <ProductDetail slug = {slug} />
    </main>
  );
}
