"use client";

import DevelopmentDirectionCard from "@/components/DevAreaCard";
import SlidingButton from "@/components/SlidingButton";
import { useTranslations } from "@/lib/localize";
import { normalizeImagePath } from "@/lib/pathutils";
import Image from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Project, DevDirection } from "@prisma/client";

interface ExtendedCasesSectionProps {
  data: (Project & { direction: DevDirection | null })[];
}

const ExtendedCasesSection: FC<ExtendedCasesSectionProps> = ({ data }) => {
  const t = useTranslations("ExtendedCasesSection");
  const tTitles = useTranslations("CasesSection_title");
  const tDescriptions = useTranslations("CasesSection_description");

  const cases = data.map((project) => ({
    title: project.name,
    description: project.name,
    logoSrc: project.imagePath || "",
    category: project.direction?.shortName || "Other",
  }));

  const categories = Array.from(
    new Set(
      data
        .map((project) => project.direction?.shortName)
        .filter((shortName): shortName is string => !!shortName)
    )
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCases, setShowAllCases] = useState(false);

  const filteredCases = selectedCategory
    ? cases.filter((item) => item.category === selectedCategory)
    : cases;

  const visibleCases = showAllCases ? filteredCases : filteredCases.slice(0, 8);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scroll Indicator
  const [showIndicator, setShowIndicator] = useState(false);
  const [, _setScrollThumbTop] = useState(8);
  const scrollThumbTopRef = useRef(8);
  const setScrollThumbTop = (val: number) => {
    scrollThumbTopRef.current = val;
    _setScrollThumbTop(val);
  };

  const categoryListRef = useRef<HTMLDivElement>(null);
  const isDraggingThumbRef = useRef(false);
  const trackHeightRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const thumbHeight = 32;

  const handleScroll = useCallback(() => {
    const container = categoryListRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowIndicator(scrollHeight > clientHeight);

    const trackHeight = clientHeight - thumbHeight;
    const thumbPosition =
      (scrollTop / (scrollHeight - clientHeight)) * trackHeight;
    setScrollThumbTop(8 + thumbPosition);
  }, []);

  const handleThumbMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingThumbRef.current || !categoryListRef.current) return;

    if (animationFrameIdRef.current)
      cancelAnimationFrame(animationFrameIdRef.current);

    animationFrameIdRef.current = requestAnimationFrame(() => {
      const container = categoryListRef.current!;
      const offsetY = e.clientY - container.getBoundingClientRect().top - 8;

      const thumbRatio = Math.max(
        0,
        Math.min(offsetY / trackHeightRef.current, 1)
      );
      const newScrollTop =
        thumbRatio * (container.scrollHeight - container.clientHeight);
      container.scrollTop = newScrollTop;
    });
  }, []);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    isDraggingThumbRef.current = true;
    trackHeightRef.current =
      categoryListRef.current!.clientHeight - thumbHeight;
    e.preventDefault();
  };

  const handleThumbMouseUp = () => {
    isDraggingThumbRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleThumbMouseMove);
    window.addEventListener("mouseup", handleThumbMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleThumbMouseMove);
      window.removeEventListener("mouseup", handleThumbMouseUp);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleThumbMouseMove]);

  useEffect(() => {
    handleScroll();
  }, [categories.length, handleScroll]);

  return (
    <section className="container w-full py-12 select-none">
      <div className="max-w-[6200px] mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-textPrimary">
          {t("title")}
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Side menu */}
          <aside className="w-full lg:w-[120px] shrink-0 relative">
            <div className="relative pl-8 pr-6">
              <div className="absolute left-0 top-[4px]">
                <Image
                  src="/icons/menu.png"
                  alt="Menu Icon"
                  width={24}
                  height={24}
                  className="mt-1"
                />
              </div>

              {/* Custom Scroll Indicator */}
              {showIndicator && (
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-[#58427C] to-[#77C3DD]">
                  <div
                    onMouseDown={handleThumbMouseDown}
                    className={`absolute left-1/2 -translate-x-1/2 w-[8px] h-8 bg-[#4D3680] rounded-md ${
                      isDraggingThumbRef.current
                        ? ""
                        : "transition-all duration-150"
                    } cursor-pointer`}
                    style={{ top: `${scrollThumbTopRef.current}px` }}
                  />
                </div>
              )}

              {/* Scrollable categories */}
              <div
                ref={categoryListRef}
                onScroll={handleScroll}
                className="flex flex-col gap-4 text-sm text-[#2e2e2e] mt-8 max-h-[300px] overflow-y-auto pr-2 cursor-auto scrollbar-hide"
              >
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowAllCases(false);
                  }}
                  className={`text-left hover:text-[#4D3680] transition cursor-pointer ${
                    selectedCategory === null ? "font-bold text-[#4D3680]" : ""
                  }`}
                >
                  {t("allCategories")}
                </button>

                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowAllCases(false);
                    }}
                    className={`text-left hover:text-[#4D3680] transition cursor-pointer ${
                      selectedCategory === category
                        ? "font-bold text-[#4D3680]"
                        : ""
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Card grid */}
          <div className="flex-1 md:pl-20 lg:pl-0">
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onMouseUp={handleMouseUp}
              className={`
                flex md:grid 
                md:grid-cols-2 
                lg:grid-cols-4 
                gap-8 
                overflow-x-auto 
                md:overflow-visible 
                scroll-smooth 
                snap-x 
                snap-mandatory 
                scrollbar-hide 
                ${isDragging ? "cursor-grabbing" : "cursor-grab"}
              `}
            >
              {visibleCases.map((item, index) => (
                <div
                  key={index}
                  className="
                    snap-start 
                    flex-shrink-0 
                    w-[420px] 
                    min-w-[480px] 
                    h-[450px] 
                    md:w-full md:min-w-0
                  "
                >
                  <DevelopmentDirectionCard
                    title={tTitles(item.title)}
                    description={tDescriptions(item.description)}
                    logoSrc={normalizeImagePath(
                      item?.logoSrc as string | undefined
                    )}
                    variant="case"
                    className="h-full"
                  />
                </div>
              ))}
            </div>

            {/* View More / Less Buttons */}
            {filteredCases.length > 8 && (
              <div className="flex justify-center mt-12">
                {!showAllCases ? (
                  <SlidingButton
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllCases(true);
                    }}
                  >
                    {t("button_moreCases")}
                  </SlidingButton>
                ) : (
                  <SlidingButton
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllCases(false);
                    }}
                  >
                    {t("button_lessCases")}
                  </SlidingButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtendedCasesSection;
