"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import type { WishListItem } from "@/redux/features/wishlist-slice";
import { useGetProductBySlugQuery } from "@/redux/services/productsApi";
import type { BackendProduct, BackendVariant } from "@/redux/services/productsApi";

import Image from "next/image";

function mapVariantToCartItem(
  product: BackendProduct,
  variant: BackendVariant | null,
  quantity: number
) {
  const imgs =
    product.images?.length || product.thumbnails?.length
      ? {
          thumbnails: product.thumbnails?.length
            ? product.thumbnails
            : product.images ?? [],
          previews: product.images ?? [],
        }
      : undefined;
  const price = (variant?.price ?? product.price) ?? 0;
  return {
    id: Number(variant?.id ?? product.id) || 0,
    title: product.title,
    variantTitle: variant?.title,
    sku: variant?.sku ?? product.sku,
    price,
    discountedPrice: variant?.compareAtPrice ?? product.discountedPrice ?? price,
    quantity,
    imgs,
    productId: String(product.id),
    variantId: String(variant?.id ?? product.id),
  };
}

const SingleItem = ({ item }: { item: WishListItem }) => {
  const imageSrc = item.imgs?.thumbnails?.[0] ?? item.imgs?.previews?.[0];
  const productHref = item.slug ? `/products/${item.slug}` : "#";
  const dispatch = useDispatch<AppDispatch>();

  const { data } = useGetProductBySlugQuery(item.slug ?? "", {
    skip: !item.slug,
  });
  const product = data?.product ?? null;
  const variants = product?.variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState<BackendVariant | null>(null);

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  const activeVariant = selectedVariant ?? variants[0] ?? null;
  const isAvailable =
    activeVariant !== null
      ? activeVariant.available
      : product
        ? product.stockStatus !== "out-of-stock"
        : false;
  const displayPrice = activeVariant?.price ?? product?.price ?? item.price ?? 0;
  const displayDiscounted =
    activeVariant?.compareAtPrice ?? product?.discountedPrice ?? item.discountedPrice ?? displayPrice;

  const handleRemoveFromWishlist = () => {
    dispatch(removeItemFromWishlist(item.id));
  };

  const handleAddToCart = () => {
    if (product && activeVariant !== null) {
      dispatch(
        addItemToCart(mapVariantToCartItem(product, activeVariant, 1))
      );
      return;
    }
    if (product && variants.length === 0) {
      dispatch(
        addItemToCart(mapVariantToCartItem(product, null, 1))
      );
      return;
    }
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      <div className="min-w-[83px]">
        <button
          onClick={() => handleRemoveFromWishlist()}
          aria-label="button for remove product from wishlist"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.19509 8.22222C8.92661 7.95374 8.49131 7.95374 8.22282 8.22222C7.95433 8.49071 7.95433 8.92601 8.22282 9.1945L10.0284 11L8.22284 12.8056C7.95435 13.074 7.95435 13.5093 8.22284 13.7778C8.49133 14.0463 8.92663 14.0463 9.19511 13.7778L11.0006 11.9723L12.8061 13.7778C13.0746 14.0463 13.5099 14.0463 13.7784 13.7778C14.0469 13.5093 14.0469 13.074 13.7784 12.8055L11.9729 11L13.7784 9.19451C14.0469 8.92603 14.0469 8.49073 13.7784 8.22224C13.5099 7.95376 13.0746 7.95376 12.8062 8.22224L11.0006 10.0278L9.19509 8.22222Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0007 1.14587C5.55835 1.14587 1.14648 5.55773 1.14648 11C1.14648 16.4423 5.55835 20.8542 11.0007 20.8542C16.443 20.8542 20.8548 16.4423 20.8548 11C20.8548 5.55773 16.443 1.14587 11.0007 1.14587ZM2.52148 11C2.52148 6.31713 6.31774 2.52087 11.0007 2.52087C15.6836 2.52087 19.4798 6.31713 19.4798 11C19.4798 15.683 15.6836 19.4792 11.0007 19.4792C6.31774 19.4792 2.52148 15.683 2.52148 11Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="min-w-[387px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5 overflow-hidden">
              {imageSrc ? (
                <Image src={imageSrc} alt={item.title} width={200} height={200} />
              ) : (
                <div className="w-full h-full min-h-[70px] bg-gray-3 flex items-center justify-center text-dark/50 text-xs">
                  No image
                </div>
              )}
            </div>

            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue">
                <Link href={productHref}>{item.title}</Link>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[220px]">
        {variants.length > 0 ? (
          <select
            value={activeVariant?.sku ?? activeVariant?.id ?? ""}
            onChange={(e) => {
              const v = variants.find(
                (x) => x.sku === e.target.value || String(x.id) === e.target.value
              );
              setSelectedVariant(v ?? null);
            }}
            className="w-full text-dark border border-gray-3 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
            aria-label="Chọn biến thể"
          >
            {variants.map((v) => (
              <option key={v.sku} value={v.sku}>
                {v.title} {v.price != null ? `— $${v.price}` : ""}
                {!v.available ? " (Hết hàng)" : ""}
              </option>
            ))}
          </select>
        ) : item.slug ? (
          <span className="text-dark-4 text-sm">Đang tải…</span>
        ) : (
          <span className="text-dark-4 text-sm">—</span>
        )}
      </div>

      <div className="min-w-[120px]">
        <p className="text-dark">
          ${typeof displayDiscounted === "number" ? displayDiscounted : displayPrice}
        </p>
      </div>

      <div className="min-w-[180px]">
        <div className="flex items-center gap-1.5">
          {isAvailable ? (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fill="#22c55e"
                />
              </svg>
              <span className="text-green-600">In Stock</span>
            </>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99935 14.7917C10.3445 14.7917 10.6243 14.5119 10.6243 14.1667V9.16669C10.6243 8.82151 10.3445 8.54169 9.99935 8.54169C9.65417 8.54169 9.37435 8.82151 9.37435 9.16669V14.1667C9.37435 14.5119 9.65417 14.7917 9.99935 14.7917Z"
                  fill="#F23030"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.04102 10C1.04102 5.05247 5.0518 1.04169 9.99935 1.04169C14.9469 1.04169 18.9577 5.05247 18.9577 10C18.9577 14.9476 14.9469 18.9584 9.99935 18.9584C5.0518 18.9584 1.04102 14.9476 1.04102 10ZM9.99935 2.29169C5.74215 2.29169 2.29102 5.74283 2.29102 10C2.29102 14.2572 5.74215 17.7084 9.99935 17.7084C14.2565 17.7084 17.7077 14.2572 17.7077 10C17.7077 5.74283 14.2565 2.29169 9.99935 2.29169Z"
                  fill="#F23030"
                />
              </svg>
              <span className="text-red">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      <div className="min-w-[150px] flex justify-end">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!!item.slug && (product == null || !isAvailable)}
          className="inline-flex text-dark hover:text-white bg-gray-1 border border-gray-3 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:border-gray-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-1 disabled:hover:text-dark"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
