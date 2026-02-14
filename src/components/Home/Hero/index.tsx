"use client";
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import { useGetProductsQuery } from "@/redux/services/shopApi";

const Hero = () => {
  // Fetch 2 products from API
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 2 });
  const products = data?.products || [];

  // Product 1 data
  const product1 = products[0];
  const product1Title = product1?.title || "Handcrafted Wooden Stool";
  const product1Price = product1?.discountedPrice || product1?.price || 699;
  const product1OriginalPrice = product1?.price || 999;
  const product1Image = product1?.thumbnailUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuD4EfLTmF0iVFQ3M8owFcbSbhnd0FtWtRb2y5h8EQEUNNcf47v95_ArQie8QPigUtgvtyOBDOD9NdOCyD0RP-M9oDaa83vQrPiVZoZEpOxJsjz4gzTqaa9QaaYpi0LG_MZsfgzvQyOENzqWZxK7hKraBl0pzGmIAWzegZ5rpS7VExVD6l11cnAIdJjE4cSXf7qH8uKJdEBKX-Q-osxpOTg5QlqOndgsfDwllc9YAfU1CcO099GPT3ssmFViQgTJFpsImlqWATDfbw";
  const product1Link = product1?.slug ? `/products/${product1.slug}` : "#";

  // Product 2 data
  const product2 = products[1];
  const product2Title = product2?.title || "Modern Floor Lamp";
  const product2Price = product2?.discountedPrice || product2?.price || 699;
  const product2OriginalPrice = product2?.price || 999;
  const product2Image = product2?.thumbnailUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBfeli0CQ7JosMxTsLYWF0UdH9ipN81lLAHlKZoEBtn9rH4sAGGVXP_rUFSPttZtDsn5m7RxAc2o6rZKJC9b70KN8mgI16zIiR36uO_MoHi_MAirEM8zoPZlo-e33nfW2UIFEm0l0Y4uw7NbLA5UvHvIQuBEx0LJvbVxwCG7wn6vnZLIlC5Ig8XLjjioYVizxmZ6UZ7_mwV-RisXT355XUS-yg8gxDmNC4rfK3N4MJhqFhmEEHah5mjxIQ1Qn2eTwWeyPJFjjDmlg";
  const product2Link = product2?.slug ? `/products/${product2.slug}` : "#";

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                      <Link href={product1Link}>{product1Title}</Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-blue">
                          ${typeof product1Price === 'number' ? product1Price.toFixed(2) : product1Price}
                        </span>
                        {product1OriginalPrice > product1Price && (
                          <span className="font-medium text-2xl text-dark-4 line-through">
                            ${typeof product1OriginalPrice === 'number' ? product1OriginalPrice.toFixed(2) : product1OriginalPrice}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src={product1Image}
                      alt={product1Title}
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                      <Link href={product2Link}>{product2Title}</Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-blue">
                          ${typeof product2Price === 'number' ? product2Price.toFixed(2) : product2Price}
                        </span>
                        {product2OriginalPrice > product2Price && (
                          <span className="font-medium text-2xl text-dark-4 line-through">
                            ${typeof product2OriginalPrice === 'number' ? product2OriginalPrice.toFixed(2) : product2OriginalPrice}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src={product2Image}
                      alt={product2Title}
                      width={130}
                      height={170}
                      className=" rounded-lg"
                    />
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
