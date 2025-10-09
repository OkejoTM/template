"use client";

import SlidingButton from "@/components/SlidingButton";
import { motion } from "framer-motion";
import { FC } from "react";
import grapelogo from "../../public/grapelogo.svg";
import { useTranslations } from '@/lib/localize';

const Hero: FC = () => {

  const t = useTranslations('Hero');

  return (
    <section className='bg-background pt-6 sm:pt-8 pb-12 sm:pb-16 relative overflow-hidden'>
      <div className='container w-full max-w-[1450px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12'>
        <div className='flex-1 max-w-full md:max-w-[680px] z-10 relative'>
          <h1 className='text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] font-bold text-textPrimary leading-tight mb-6 sm:mb-8'
            dangerouslySetInnerHTML={{ __html: t.raw('title') }} // Используем raw для <br />
          />

          <ul className='list-disc pl-5 text-textPrimary text-[14px] sm:text-[15px] md:text-[16px] leading-[1.8] space-y-2'>
            <li>{t('listItem1')}</li>
            <li>{t('listItem2')}</li>
            <li>{t('listItem3')}</li>
            <li>{t('listItem4')}</li>
            <li>{t('listItem5')}</li>
          </ul>

          <SlidingButton className='mt-6 sm:mt-8' href='#'>
             {t('button')}
          </SlidingButton>
        </div>
        {/* Logo Section-only appears from lg: 1200px */}
        <div className='flex-1 hidden lg:flex justify-end'>
          <motion.img
            src={grapelogo.src}
            alt='Grape logo'
            className='
              w-[140px] 
              sm:w-[400px] 
              md:w-[300px] 
              lg:w-[400px] 
              xl:w-[500px]
              h-auto
              m-auto
              object-contain
            '
            animate={{
              translateY: [-5, 5],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 3,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
