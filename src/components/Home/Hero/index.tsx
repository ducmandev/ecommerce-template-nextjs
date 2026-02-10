import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
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
                      <a href="#"> Handcrafted Wooden Stool </a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-blue">
                          $699
                        </span>
                        <span className="font-medium text-2xl text-dark-4 line-through">
                          $999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4EfLTmF0iVFQ3M8owFcbSbhnd0FtWtRb2y5h8EQEUNNcf47v95_ArQie8QPigUtgvtyOBDOD9NdOCyD0RP-M9oDaa83vQrPiVZoZEpOxJsjz4gzTqaa9QaaYpi0LG_MZsfgzvQyOENzqWZxK7hKraBl0pzGmIAWzegZ5rpS7VExVD6l11cnAIdJjE4cSXf7qH8uKJdEBKX-Q-osxpOTg5QlqOndgsfDwllc9YAfU1CcO099GPT3ssmFViQgTJFpsImlqWATDfbw"
                      alt="mobile image"
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
                      <a href="#"> Modern Floor Lamp </a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-blue">
                          $699
                        </span>
                        <span className="font-medium text-2xl text-dark-4 line-through">
                          $999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfeli0CQ7JosMxTsLYWF0UdH9ipN81lLAHlKZoEBtn9rH4sAGGVXP_rUFSPttZtDsn5m7RxAc2o6rZKJC9b70KN8mgI16zIiR36uO_MoHi_MAirEM8zoPZlo-e33nfW2UIFEm0l0Y4uw7NbLA5UvHvIQuBEx0LJvbVxwCG7wn6vnZLIlC5Ig8XLjjioYVizxmZ6UZ7_mwV-RisXT355XUS-yg8gxDmNC4rfK3N4MJhqFhmEEHah5mjxIQ1Qn2eTwWeyPJFjjDmlg"
                      alt="mobile image"
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
