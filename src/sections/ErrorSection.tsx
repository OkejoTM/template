"use client";

import Image from 'next/image';
import grapelogo from '/public/grapelogo.svg';
import { useTranslations } from '@/lib/localize';

interface ErrorSectionProps {
  errorCode?: number;
  errorMessage?: string;
  homeLink?: string;
  homeLinkText?: string;
  reloadAction?: () => void;
  secondaryText?: string;
  reloadText?: string;
}


export default function ErrorSection({
  errorCode = 404,
  homeLink = '/',
  secondaryText = undefined,
  reloadAction = undefined,
}: ErrorSectionProps) { // Скорее всего стоит сделать ReadOnly<ErrorSectionProps>
  const showLogo = errorCode.toString()[1] === '0';
  const t = useTranslations("ErrorSection")

  return (
    <section className='bg-[#F2F0F5] px-4 md:px-10 lg:px-20 py-20 flex flex-col items-center justify-center min-h-screen'>
      <div className='w-full max-w-[1200px] mx-auto text-center'>
        {/* Блок с кодом ошибки */}
        <div className='mb-8 md:mb-12 lg:mb-16'>
          {showLogo ? (
            <div className='flex justify-center items-center'>
              <span
                className={`text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-bold text-[#58427C]`}
              >
                {errorCode.toString()[0]}
              </span>

              {/* Серый круг с логотипом */}
              <div className='mx-2 sm:mx-4 flex items-center justify-center'>
                <div className='relative w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32'>
                  {/* Серый круг (фон) */}
                  <div className='absolute inset-0 bg-[#eeeded] rounded-full shadow-md'></div>

                  {/* Логотип с минимальными отступами */}
                  <div className='absolute inset-0 flex items-center justify-center p-0'>
                    <Image
                      src={grapelogo}
                      alt='Логотип'
                      fill
                      className='object-cover'
                    />
                  </div>
                </div>
              </div>

              <span
                className={`text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-bold text-[#58427C]`}
              >
                {errorCode.toString()[2]}
              </span>
            </div>
          ) : (
            <h1
              className={`text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-bold text-[#4C484B]`}
            >
              {errorCode}
            </h1>
          )}
        </div>

        {/* Сообщение об ошибке */}
        <h2
          className={`text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold text-[#4C484B] mb-6 md:mb-10`}
        >
          {t("errorMessage")}
        </h2>

        {secondaryText && (
          <h4 className={`text-[#4C484B] mb-6 md:mb-10 text-base sm:text-lg`}>{secondaryText}</h4>
        )}

        {reloadAction && (
          <div>
            <a
              href='#'
              onClick={reloadAction}
              className={`inline-block text-base sm:text-lg md:text-xl lg:text-2xl mb-4 font-bold text-[#58427C] hover:text-[#42315d] transition-colors no-underline`}
            >
              {t("reloadText")}
            </a>
          </div>
        )}

        {/* Ссылка для возврата (без подчеркивания, жирная) */}
        <div>
          <a
            href={homeLink}
            className={`inline-block text-base sm:text-lg md:text-xl lg:text-2xl mb-4 font-bold text-[#58427C] hover:text-[#42315d] transition-colors no-underline`}
          >
            {t("homeLinkText")}
          </a>
        </div>
      </div>
    </section>
  );
}