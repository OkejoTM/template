"use client";

import { useTranslations } from '@/lib/localize';

export default function MapSection() {
  const t = useTranslations('MapSection');

  return (
    <div className='container py-10 sm:py-12 md:py-16 bg-[#F2F0F5]'>
      <div className='mx-auto px-4 max-w-[1200px]'>
        <h2 className='text-[32px] font-semibold mb-8 md:mb-12 md:text-left'>
          {t('title')}
        </h2>

        <div className='w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl border border-[#D1CFE2] shadow-md overflow-hidden'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2632.620610858594!2d44.52406017693866!3d48.71273201094517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x411acb2dc030bef3%3A0xc8db95aee8f79b!2z0L_RgC4g0LjQvNC10L3QuCDQki7QmC4g0JvQtdC90LjQvdCwLCAyONCwLCDQktC-0LvQs9C-0LPRgNCw0LQsINCS0L7Qu9Cz0L7Qs9GA0LDQtNGB0LrQsNGPINC-0LHQuy4sIDQwMDAwNQ!5e0!3m2!1sru!2sru!4v1747088120780!5m2!1sru!2sru'
            width='100%'
            height='100%'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
        </div>
      </div>
    </div>
  );
}
