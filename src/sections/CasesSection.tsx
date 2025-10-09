"use client";

import DevelopmentDirectionCard from "@/components/DevAreaCard";
import SlidingButton from "@/components/SlidingButton";
import { useTranslations } from "@/lib/localize";
import { normalizeImagePath } from "@/lib/pathutils";
import { Project } from "@prisma/client";
import { useRef, useState, FC } from "react";

interface CasesSectionProps {
  data: Project[];
}

const CasesSection: FC<CasesSectionProps> = ({ data }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showAll, setShowAll] = useState(false);

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

  const tCases = useTranslations("CasesSection"); // Для общих ключей, как 'title'
  const tTitles = useTranslations("CasesSection_title"); // Для названий кейсов
  const tDescriptions = useTranslations("CasesSection_description"); // Для описаний кейсов

  const items = data.map((project) => ({
    title: project.name,
    description: project.name,
    logoSrc: project.imagePath || "",
  }));

  const visibleItems = showAll ? items : items.slice(0, 4);

  return (
    <section className="container max-w-[1200px] mx-auto px-4 md:pl-12 py-12 select-none">
      <h2 className="font-semibold text-[30px] sm:text-[32px] md:text-[36px] leading-[36px] text-textPrimary mb-8 text-left">
        {tCases("title")}
      </h2>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        className={`
              flex 
              md:grid 
              md:grid-cols-2 
              lg:grid-cols-4 
              gap-6 
              overflow-x-auto 
              md:overflow-visible 
              scroll-smooth 
              snap-x 
              snap-mandatory 
              pb-4 
              scrollbar-hide
              ${isDragging ? "cursor-grabbing" : "cursor-grab"} 
              select-none
          `}
      >
        {visibleItems.map((item, i) => (
          <DevelopmentDirectionCard
            key={i}
            title={tTitles(item.title)}
            description={tDescriptions(item.description)}
            logoSrc={normalizeImagePath(item.logoSrc)}
            variant="case"
            className="w-[280px] min-w-[280px] h-[455px] flex-shrink-0 snap-start"
          />
        ))}
      </div>

      {items.length > 4 && (
        <div className="flex justify-center mt-12">
          <SlidingButton
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAll((prev) => !prev);
            }}
          >
            {showAll ? tCases("button_lessCases") : tCases("button_moreCases")}
          </SlidingButton>
        </div>
      )}
    </section>
  );
};

export default CasesSection;
