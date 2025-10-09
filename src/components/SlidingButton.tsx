"use client";

import { ArrowRight } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface SlidingButtonProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

const SlidingButton = ({
  children,
  className = '',
  ...props
}: SlidingButtonProps) => {
  return (
    <Link
      {...props}
      className={`group relative inline-flex items-center h-10 pl-1 pr-8 font-semibold text-[16px] text-[var(--color-buttons)] hover:text-white transition-colors duration-300 overflow-visible ${className}`}
    >
      {/* Круг с иконкой */}
      <span className='flex items-center justify-center w-10 h-10 bg-[var(--color-buttons)] rounded-full group-hover:bg-[#77C3DD] transition-all duration-400 mr-3 z-10'>
        <ArrowRight className='w-5 h-5 text-white' />
      </span>

      {/* Текст */}
      <span className='z-10 whitespace-nowrap'>{children}</span>

      {/* Голубая подложка (выходит из середины круга) */}
      <span
        className='absolute left-5 top-1/2 h-10 w-0 bg-[#77C3DD] origin-left transition-all duration-500 ease-in-out z-0
            group-hover:w-[calc(100%+0.15rem)] group-hover:rounded-r-full 
            group-hover:translate-x-[+0.28rem] group-hover:h-10 -translate-y-1/2'
        style={{
          transitionProperty:
            'width, height, border-radius, background, transform',
        }}
      >
        <span className='absolute left-0 top-0 h-full w-5 bg-[#77C3DD] opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100'></span>
      </span>
    </Link>
  );
};

export default SlidingButton;