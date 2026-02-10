"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="flex items-center justify-evenly pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                30%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="#">Modern Minimalist Dining Set</a>
            </h1>

            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum at risus euismod lobortis in
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-blue py-3 px-9 ease-out duration-200 hover:bg-blue-dark mt-10"
            >
              Shop Now
            </a>
          </div>

          <div>
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKE2QsvR5PWun9zhFfJT1IsPqEFEcQ1ELsT50gKcmfWdHQst3PHSYnpXJxNEJU-Q5nstAKsh2b8tFwM1MEYGC578JQF1-uwhDoyu2RL-DDxsHmTOjYqAQ1GHYvvIbSuUFMj2z02mFsYKAqjGlEt5O46hQE5qR55newBhi8IEd8-w5-APe219HkSRtadOY5Ni29l0ZXu5GWENu3T_16AxVvxIqcTaLhzPJjmOH_2tzGPHoxo4VOE5S0vYRRdTjN_itHu8f7KnW16A"
              alt="headphone"
              width={351}
              height={358}
              className="w-full h-full rounded-[50%]"
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        {" "}
        <div className="flex items-center justify-evenly pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
              40%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="#">Modern Minimalist Dining Set</a>
            </h1>

            <p>
            Elevate your dining experience with our new collection of sleek tables and comfortable chairs, perfect for modern homes.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-blue py-3 px-9 ease-out duration-200 hover:bg-blue-dark mt-10"
            >
              Shop Now
            </a>
          </div>

          <div>
          <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKE2QsvR5PWun9zhFfJT1IsPqEFEcQ1ELsT50gKcmfWdHQst3PHSYnpXJxNEJU-Q5nstAKsh2b8tFwM1MEYGC578JQF1-uwhDoyu2RL-DDxsHmTOjYqAQ1GHYvvIbSuUFMj2z02mFsYKAqjGlEt5O46hQE5qR55newBhi8IEd8-w5-APe219HkSRtadOY5Ni29l0ZXu5GWENu3T_16AxVvxIqcTaLhzPJjmOH_2tzGPHoxo4VOE5S0vYRRdTjN_itHu8f7KnW16A"
              alt="headphone"
              width={351}
              height={358}
              className="w-full h-full rounded-[50%]"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
