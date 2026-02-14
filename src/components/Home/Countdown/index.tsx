"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGetCountdownDealQuery } from "@/redux/services/homeApi";

const CountDown = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Fetch countdown deal data
  const { data, isLoading, isError } = useGetCountdownDealQuery();
  const deal = data?.deal;

  // Sử dụng endsAt từ API nếu có, nếu không dùng default
  const deadline = deal?.endsAt || "December, 31, 2024";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  // Data từ API hoặc fallback
  const title = deal?.title || "Enhance Your Experience";
  const subtitle = deal?.subtitle || "Lamp Sale";
  const productName = deal?.product?.title || "";
  const productPrice = deal?.product?.price || 0;
  const productDiscountedPrice = deal?.product?.discountedPrice;
  const productImage = deal?.product?.thumbnailUrl || "https://www.pngplay.com/wp-content/uploads/2/Lamp-PNG-Pic-Background.png";
  const productLink = deal?.product?.slug ? `/products/${deal.product.slug}` : "#";

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-lg bg-[#D0E9F3] p-4 sm:p-7.5 lg:p-10 xl:p-15 w-full">
          <div className="max-w-[520px] w-full">
            <span className="block font-medium text-custom-1 text-blue mb-2.5">
              Don't Miss!!
            </span>

            <h2 className="font-bold text-dark text-xl lg:text-heading-4 xl:text-heading-3 mb-3">
              {title}
            </h2>

            <p className="text-dark-2 mb-4">{subtitle}</p>

            {/* Product Info */}
            {productName && (
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-5 border border-white/80">
                <h3 className="font-semibold text-dark text-lg mb-2 line-clamp-2">
                  {productName}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue">
                    ${productPrice.toFixed(2)}
                  </span>
                  {productDiscountedPrice && productDiscountedPrice < productPrice && (
                    <span className="text-lg text-dark-4 line-through">
                      ${productDiscountedPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* <!-- Countdown timer --> */}
            <div
              className="flex flex-wrap gap-6 mt-6"
              x-data="timer()"
              x-init="countdown()"
            >
              {/* <!-- timer day --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="days"
                >
                  {" "}
                  {days < 10 ? "0" + days : days}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  Days
                </span>
              </div>

              {/* <!-- timer hours --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="hours"
                >
                  {" "}
                  {hours < 10 ? "0" + hours : hours}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  Hours
                </span>
              </div>

              {/* <!-- timer minutes --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="minutes"
                >
                  {minutes < 10 ? "0" + minutes : minutes}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  Minutes
                </span>
              </div>

              {/* <!-- timer seconds --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="seconds"
                >
                  {seconds < 10 ? "0" + seconds : seconds}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  Seconds
                </span>
              </div>
            </div>
            {/* <!-- Countdown timer ends --> */}

            <a
              href={productLink}
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Check it Out!
            </a>
          </div>

          {/* <!-- bg shapes --> */}
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="bg shapes"
            className="hidden sm:block absolute right-0 bottom-0 -z-1"
            width={737}
            height={482}
          />
          <Image
            src={productImage}
            alt={deal?.product?.title || "product"}
            className="hidden lg:block absolute right-2 xl:right-33 bottom-4 xl:bottom-10 -z-1 rounded-[50%]"
            width={411}
            height={376}
          />
        </div>
      </div>
    </section>
  );
};

export default CountDown;
