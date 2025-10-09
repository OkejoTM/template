"use client";
import { useTranslations } from '@/lib/localize';
import { JsonObject } from '@prisma/client/runtime/library';
import Image from 'next/image';
import React from 'react';

interface FooterProps {
  data: JsonObject;
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  const t = useTranslations('Footer');

  return (
    <div
      className='bg-site px-4 sm:px-6 md:px-8 lg:px-10 mb-16'
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <footer className='bg-footer text-textWhite py-10 rounded-[20px] w-full max-w-[1854px] mx-auto mt-16 px-4 sm:px-6 md:px-10'>
        <div className='flex flex-col md:flex-row justify-between gap-10'>
          {/* Левая колонка */}
          <div className='flex-1'>
            <h2 className='text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1] font-semibold mb-4'>
              {t('grapelabTitle')}
            </h2>
            <p className='text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] mb-6'>
              {t('description')}
            </p>
            <div className='flex space-x-4'>
              <a
                href={
                  (data.telegram as string)
                    ? `https://t.me/${data.telegram}`
                    : '#'
                }
              >
                <Image
                  src='/icons/telegram.svg'
                  alt='Telegram'
                  width={40}
                  height={40}
                />
              </a>
              <a href={(data.phone as string) ? `tel:${data.phone}` : '#'}>
                <Image
                  src='/icons/phone.svg'
                  alt='Phone'
                  width={40}
                  height={40}
                />
              </a>
              <a href={(data.vk as string) ? `https://vk.com/${data.vk}` : '#'}>
                <Image src='/icons/vk.svg' alt='VK' width={40} height={40} />
              </a>
              <a href={(data.email as string) ? `mailto:${data.email}` : '#'}>
                <Image
                  src='/icons/email.svg'
                  alt='Email'
                  width={40}
                  height={40}
                />
              </a>
            </div>
          </div>

          {/* Средняя колонка (Навигация) */}
          <div className='flex-1 max-w-xs'>
            <h3 className='text-[20px] md:text-[24px] font-semibold mb-2'>
              {t("link.navigation")}
            </h3>
            <ul className='text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] font-normal space-y-1'>
              <li>
                <a href='/portfolio' className='hover:underline'>
                  {t('link.cases')}
                </a>
              </li>
              <li>
                <a href='/team' className='hover:underline'>
                  {t('link.team')}
                </a>
              </li>
              <li>
                <a href='/contacts' className='hover:underline'>
                  {t('link.contacts')}
                </a>
              </li>
            </ul>
          </div>

          {/* Правая колонка (Контакты) */}
          <div className='flex-1 max-w-xs'>
            <h3 className='text-[20px] md:text-[24px] font-semibold mb-2'>
              {t('link.contacts')}
            </h3>
            <p className='text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] font-normal'>
              {(data.phone as string) ?? ''}
            </p>
            <p className='text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] font-normal'>
              {(data.email as string) ?? ''}
            </p>
          </div>
        </div>

        <hr className='my-8 border-white/20' />

        <div className='flex flex-col md:flex-row justify-between items-start md:items-center text-[12px] sm:text-[14px] text-white/80 gap-4'>
          <p>{t('copyright')}</p>
          <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0'>
            <a href='#' className='hover:underline'>
              {t('privacyPolicy')}
            </a>
            <a href='#' className='hover:underline'>
              {t('TermsOfService')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
