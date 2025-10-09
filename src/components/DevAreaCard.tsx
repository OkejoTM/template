"use client";

import { useTranslations } from "@/lib/localize";
import Image from "next/image";
import { FC } from "react";

// Props interface
export interface DevelopmentDirectionCardProps {
  title: string;
  description: string;
  icon?: JSX.Element;
  logoSrc?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  variant?: "default" | "case";
}

// DirectionCard reusable component with variant support
const DevelopmentDirectionCard: FC<DevelopmentDirectionCardProps> = ({
  title,
  description,
  icon,
  logoSrc,
  className = "",
  bgColor = "bg-white",
  textColor = "text-gray-800",
  variant = "default",
}) => {
  const t = useTranslations("DevelopmentDirectionCard");

  // Check if parent component (like CasesSection) passed a custom height
  const hasCustomHeight = className.includes("h-[");
  const heightClass = hasCustomHeight ? "" : "h-[520px]";

  // Case variant (like the "Cases" section)
  if (variant === "case") {
    return (
      <div
        className={`
          w-full max-w-[271px]
          ${heightClass}
          bg-gradient-to-b from-[#58427C] to-[#77C3DD]
          p-[1.5px] rounded-xl shrink-0
          ${className}
        `}
      >
        <div
          className="
            w-full h-full bg-[#f5f2fd] rounded-xl 
            p-6 flex flex-col justify-between items-center 
            text-center overflow-hidden
          "
        >
          {/* Logo */}
          {logoSrc && (
            <div className="w-[120px] h-[120px] flex items-center justify-center shrink-0">
              <Image
                src={logoSrc}
                alt={`${title} logo`}
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          )}

          {/* Texts */}
          <div className="mt-6 flex-1 flex flex-col justify-start">
            <h3
              className="
                text-base font-bold text-textPrimary 
                mb-3 leading-tight line-clamp-2 break-words
              "
            >
              {title}
            </h3>

            <p
              className="
                text-sm text-[#6C5D9E] leading-relaxed 
                line-clamp-5 break-words px-1
              "
            >
              {description}
            </p>
          </div>

          {/* Learn More */}
          <div className="w-full pt-4 text-left">
            <span className="text-sm font-semibold text-textPrimary cursor-pointer hover:underline">
              {t("learnMore")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant (standard usage in other sections)
  return (
    <div
      className={`rounded-lg p-5 shadow-md flex flex-col gap-4 ${bgColor} ${textColor} ${className}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">{title}</span>
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={`${title} logo`}
            width={60}
            height={60}
            className="object-contain"
          />
        ) : (
          <div className={`text-3xl ${textColor}`}>{icon}</div>
        )}
      </div>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default DevelopmentDirectionCard;
