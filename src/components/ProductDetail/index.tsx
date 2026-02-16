"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { useGetProductBySlugQuery } from "@/redux/services/productsApi";
import type {
  BackendProduct,
  BackendVariant,
} from "@/redux/services/productsApi";
import RecentlyViewdItems from "@/components/ShopDetails/RecentlyViewd";
import ReviewsList from "./ReviewsList";


const STAR_SVG = (
  <svg className="fill-[#FFA645]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z" fill="" />
  </svg>
);

const CHECK_SVG = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z" fill="#73122a" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z" fill="#73122a" />
  </svg>
);

function mapProductToCartItem(
  product: BackendProduct,
  variant: BackendVariant | null,
  quantity: number
) {
  const imgs =
    product.images?.length || product.thumbnails?.length
      ? {
          thumbnails: product.thumbnails?.length
            ? product.thumbnails
            : product.images,
          previews: product.images,
        }
      : undefined;
  // Giá trong cart luôn lấy theo sku (variant.price),
  // nếu không có variant thì fallback product.price.
  const price = (variant?.price ?? product.price) || 0;
  return {
    id: Number(variant?.id ?? product.id) || 0,
    title: product.title,
    variantTitle: variant?.title,
    sku: variant?.sku ?? product.sku,
    price,
    discountedPrice: price,
    quantity,
    imgs,
    productId: String(product.id),
    variantId: String(variant?.id ?? product.id),
  };
}

export default function ProductDetail( {slug}) {
  const router = useRouter();
  const [previewImg, setPreviewImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<BackendVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("tabOne");

  const { openPreviewModal } = usePreviewSlider();
  const dispatch = useDispatch<AppDispatch>();

  const { data, isLoading, isError, error } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });

  const product = data?.product ?? null;
  const variants = useMemo(() => product?.variants ?? [], [product]);
  const selected = selectedVariant ?? variants[0] ?? null;

  useEffect(() => {
    if (variants.length && !selectedVariant) setSelectedVariant(variants[0]);
  }, [variants, selectedVariant]);

  const images = product?.images ?? [];
  const thumbnails = product?.thumbnails?.length
    ? product.thumbnails
    : images;
  const previews = images;
  const currentPreview = previews[previewImg];

  const handlePreviewSlider = () => {
    if (!product || !selected) return;
    dispatch(
      updateproductDetails({
        id: Number(product.id) || 0,
        title: product.title,
        slug: product.slug,
        price: selected.price ?? product.price,
        discountedPrice:
          product.discountedPrice ??
          selected.compareAtPrice ??
          selected.price ??
          product.price,
        reviews: product.reviewCount ?? 0,
        imgs: { thumbnails, previews },
      })
    );
    openPreviewModal();
  };

  const handleAddToCart = () => {
    if (!product || !selected) return;
    dispatch(addItemToCart(mapProductToCartItem(product, selected, quantity)));
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    const price = selected?.price ?? product.price ?? 0;
    const imgs =
      product.images?.length || product.thumbnails?.length
        ? {
            thumbnails: product.thumbnails?.length ? product.thumbnails : product.images ?? [],
            previews: product.images ?? [],
          }
        : undefined;
    dispatch(
      addItemToWishlist({
        id: Number(selected?.id ?? product.id) || 0,
        title: product.title,
        price,
        discountedPrice: selected?.compareAtPrice ?? product.discountedPrice ?? price,
        quantity: 1,
        status: product.stockStatus !== "out-of-stock" ? "available" : "out-of-stock",
        slug: product.slug,
        imgs,
      })
    );
  };

  const handleBuyNow = () => {
    if (!product || !selected ) return;
    dispatch(addItemToCart(mapProductToCartItem(product, selected, quantity)));
    router.push("/checkout");
  };

  const tabs = [
    { id: "tabOne", title: "Description" },
    { id: "tabTwo", title: "Additional Information" },
    { id: "tabThree", title: "Reviews" },
  ];

  if (!slug) {
    return (
      <main>
        <Breadcrumb title="Product" pages={["product"]} />
        <section className="py-20 text-center text-dark">Missing product slug.</section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main>
        <Breadcrumb title="Product" pages={["product"]} />
        <section className="py-20 text-center text-dark">Loading product...</section>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main>
        <Breadcrumb title="Product" pages={["product"]} />
        <section className="py-20 text-center text-red">
          {error && "message" in error ? String((error as { message?: string }).message) : "Product not found."}
        </section>
      </main>
    );
  }

  const price = selected ? selected.price : product.price;
  const compareAt =
    (selected && selected.compareAtPrice) ??
    (product.discountedPrice ?? null);
  const isAvailable =
    typeof selected?.available === "boolean"
      ? selected.available
      : product.stockStatus !== "out-of-stock";

  // Debug: Kiểm tra cấu trúc product
  // console.log('ProductDetail - product:', {
  //   title: product.title,
  //   titleType: typeof product.title,
  //   category: product?.category,
  // });
  
  // Đảm bảo title là string, không phải object
  const safeTitle = typeof product.title === 'string' ? product.title : product.title || 'Product';

  const ratingRender = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <span key={i}>{STAR_SVG}</span>
    ));
  };
  
  return (
    <>
      <Breadcrumb title={safeTitle} pages={["shop", "product"]} />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            {/* Gallery */}
            <div className="lg:max-w-[570px] w-full">
              <div className="rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative">
                {/* Fixed frame (prevents layout jump) */}
                <div className="relative w-full aspect-square lg:min-h-[512px] rounded-lg overflow-hidden flex items-center justify-center">
                  <button
                    onClick={handlePreviewSlider}
                    aria-label="Zoom"
                    className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                  >
                    <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581Z" fill="" />
                    </svg>
                  </button>
                  {currentPreview && (
                    <Image
                      src={currentPreview}
                      alt={safeTitle}
                      width={512}
                      height={512}
                      className="object-contain w-full h-full"
                    />
                  )}
                </div>
              </div>
              {images.length > 0 && (
                <div className="mt-6">
                  <div className="flex w-full max-w-full gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
                    {images.map((src, key) => (
                      <button
                        key={key}
                        onClick={() => setPreviewImg(key)}
                        className={`snap-start shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                          key === previewImg ? "border-blue" : "border-transparent"
                        }`}
                        aria-label={`Preview image ${key + 1}`}
                        type="button"
                      >
                        <Image
                          width={96}
                          height={96}
                          src={src}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="max-w-[539px] w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                  {safeTitle}
                </h2>
                {product?.discountedPrice && <span className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                  SALE
                </span>}
              </div>

              <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    {ratingRender(product.rating || 0)}
                  </div>
                  <span className="text-custom-sm text-dark-2">
                    ({product.reviewCount ?? 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {CHECK_SVG}
                  <span
                    className={`text-custom-sm ${
                      isAvailable ? "text-green" : "text-dark-4"
                    }`}
                  >
                    {isAvailable ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </div>

              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="text-sm sm:text-base text-dark">
                  Price: ${price.toFixed(2)}
                </span>
                {compareAt && compareAt > price && (
                  <span className="ml-3 text-sm sm:text-base text-dark-4 line-through">
                    ${compareAt.toFixed(2)}
                  </span>
                )}
              </h3>

              {/* <ul className="flex flex-col gap-2 mb-6">
                <li className="flex items-center gap-2.5">{CHECK_SVG} Free delivery available</li>
                <li className="flex items-center gap-2.5">{CHECK_SVG} Sales 30% Off Use Code: PROMO30</li>
              </ul> */}

              {/* Variants */}
              {variants.length > 0 && (
                <div className="flex flex-col gap-4.5 border-y border-gray-3 py-9">
                  <div className="flex items-center gap-4">
                    <h4 className="font-medium text-dark min-w-[80px]">
                      Finish:
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {variants.map((v, index) => (
                        <label
                          key={index}
                          className="cursor-pointer select-none flex items-center"
                        >
                          <input
                            type="radio"
                            name="variant"
                            className="sr-only"
                            checked={
                              selected ? selected === v : index === 0
                            }
                            onChange={() => setSelectedVariant(v)}
                          />
                          <span
                            className={`inline-block py-1.5 px-3 rounded-md border text-custom-sm ${
                              selected === v
                                ? "border-blue bg-blue/10 text-blue"
                                : "border-gray-4 text-dark"
                            }`}
                          >
                            {v.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4.5 mt-6">
                <div className="flex items-center rounded-md border border-gray-3">
                  <button
                    aria-label="Decrease quantity"
                    className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    <svg className="fill-current" width="20" height="2" viewBox="0 0 20 2" fill="none">
                      <path d="M0 1C0 0.447715 0.447715 0 1 0H19C19.5523 0 20 0.447715 20 1C20 1.55228 19.5523 2 19 2H1C0.447715 2 0 1.55228 0 1Z" fill="currentColor" />
                    </svg>
                  </button>
                  <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4 font-medium text-dark">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5C9 4.44772 9.44772 4 10 4Z" fill="currentColor" />
                      <path d="M4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5C4.44772 11 4 10.5523 4 10Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  // disabled={!isAvailable}
                  className="inline-flex font-medium text-white bg-dark py-3 px-7 rounded-md ease-out duration-200 hover:bg-opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center w-12 h-12 rounded-md border border-gray-3 ease-out duration-200 hover:text-white hover:bg-dark hover:border-transparent"
                  aria-label="Add to wishlist"
                >
                  <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.62436 4.42423C3.96537 5.18256 2.75 6.98626 2.75 9.13713C2.75 11.3345 3.64922 13.0283 4.93829 14.4798C6.00072 15.6761 7.28684 16.6677 8.54113 17.6346C8.83904 17.8643 9.13515 18.0926 9.42605 18.3219C9.95208 18.7366 10.4213 19.1006 10.8736 19.3649C11.3261 19.6293 11.6904 19.75 12 19.75C12.3096 19.75 12.6739 19.6293 13.1264 19.3649C13.5787 19.1006 14.0479 18.7366 14.574 18.3219C14.8649 18.0926 15.161 17.8643 15.4589 17.6346C16.7132 16.6677 17.9993 15.6761 19.0617 14.4798C20.3508 13.0283 21.25 11.3345 21.25 9.13713C21.25 6.98626 20.0346 5.18256 18.3756 4.42423C16.7639 3.68751 14.5983 3.88261 12.5404 6.02077C12.399 6.16766 12.2039 6.25067 12 6.25067C11.7961 6.25067 11.601 6.16766 11.4596 6.02077C9.40166 3.88261 7.23607 3.68751 5.62436 4.42423Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="overflow-hidden bg-gray-2 py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${activeTab === tab.id ? "text-blue before:w-full" : "text-dark before:w-0"}`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <div className={`mt-12.5 ${activeTab === "tabOne" ? "block" : "hidden"}`}>
            <div className="flex flex-col sm:flex-row gap-7.5 xl:gap-12.5">
              <div className="max-w-[670px] w-full">
                <h2 className="font-medium text-2xl text-dark mb-7">Specifications</h2>
                <div
                  className="prose prose-sm max-w-none text-dark"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml?.replace(/<br\s*\/?>/gi, "<br />") || "<p>No description.</p>",
                  }}
                />
              </div>
            </div>
          </div>

          <div className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${activeTab === "tabTwo" ? "block" : "hidden"}`}>
            <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
              <div className="max-w-[450px] min-w-[140px] w-full">
                <p className="text-sm sm:text-base text-dark">Brand</p>
              </div>
              <div className="w-full">
                <p className="text-sm sm:text-base text-dark">{product?.brand?.name || "—"}</p>
              </div>
            </div>
            <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
              <div className="max-w-[450px] min-w-[140px] w-full">
                <p className="text-sm sm:text-base text-dark">Product type</p>
              </div>
              <div className="w-full">
                {/* <p className="text-sm sm:text-base text-dark">{product.category?.name || "—"}</p> */}
              </div>
            </div>
            {selected && (
              <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                <div className="max-w-[450px] min-w-[140px] w-full">
                  <p className="text-sm sm:text-base text-dark">SKU</p>
                </div>
                <div className="w-full">
                  <p className="text-sm sm:text-base text-dark">{selected?.sku || "—"}</p>
                </div>
              </div>
            )}
          </div>

          <div className={`mt-12.5 ${activeTab === "tabThree" ? "block" : "hidden"}`}>
            <h2 className="font-medium text-2xl text-dark mb-9">Reviews</h2>
            <ReviewsList slug={slug} />
          </div>
        </div>
      </section>

      <RecentlyViewdItems />
    </>
  );
}
