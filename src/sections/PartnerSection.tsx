"use client";

import { useTranslations } from "@/lib/localize";
import { Partner } from "@prisma/client";
import Image from "next/image";
import "swiper/css";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface PartnerProps {
  data: Partner[];
}

export default function PartnerSection({ data }: PartnerProps) {
  const t = useTranslations("PartnerSection");

  return (
    <section className="py-16 bg-site">
      <div className="container max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl font-semibold text-left mb-12 text-headings">
          {t("title")}
        </h2>
        <PartnerCarousel partners={data} />
      </div>
    </section>
  );
}

function PartnerCarousel({ partners }: { partners: Partner[] }) {
  return (
    <div className="partners relative overflow-hidden py-4">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={40}
        slidesPerView="auto"
        loop={true}
        freeMode={{ enabled: true, momentum: false }}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        allowTouchMove={true}
        onTouchStart={(swiper) => swiper.autoplay.stop()}
        onTouchEnd={(swiper) => swiper.autoplay.start()}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 20 },
          640: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
          1280: { slidesPerView: 5, spaceBetween: 50 },
        }}
        className="w-full h-24"
      >
        {[...partners, ...partners].map((partner, index) => (
          <SwiperSlide key={`${partner.id}-${index}`} className="!w-auto">
            <div className="relative h-20 w-48 flex items-center justify-center group">
              {partner.imagePath ? (
                <Image
                  src={partner.imagePath}
                  alt={partner.name ?? ""}
                  width={150}
                  height={60}
                  className="max-h-12 object-contain"
                />
              ) : (
                <a
                  href={!partner.url || !partner.url.trim() ? "#" : partner.url}
                  className="text-xl font-light text-textPrimary text-center transition-all duration-300 group-hover:font-medium group-hover:text-primary"
                >
                  {partner.name}
                </a>
              )}
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transform -translate-x-1/2 transition-all duration-300 group-hover:w-3/4"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
