"use client"; // Используем клиентский компонент в Next.js

import { normalizeImagePath } from '@/lib/pathutils';
import { RefTable } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import Image from 'next/image'; // Импорт компонента для оптимизированной загрузки изображений
import { useTranslations } from 'use-intl'; // Хук для интернационализации

interface TechnologiesSectionProps {
  data: RefTable | null | undefined;
}

export default function TechnologiesSection({
  data,
}: TechnologiesSectionProps) {
  const content = data?.content as JsonObject[];
  const technologies = content
    ? content.map((item) => {
        return {
          icon: item.image_url ?? '',
          alt: item.alt ?? '',
        };
      })
    : [];

  const t = useTranslations('TechnologiesSection'); // Инициализация переводов для данного раздела

  return (
    <div className='container py-16 bg-background'>
      {' '}
      {/* Внешний контейнер с вертикальными отступами и фоном */}
      {/* Контейнер для центрирования и адаптивной ширины */}
      <div className='mx-auto px-4 max-w-[1200px]'>
        {/* Заголовок раздела */}
        <h2 className='text-[32px] font-semibold mb-16 text-textPrimary  md:text-left'>
          {t('title')}
        </h2>

        {/* Сетка для отображения иконок технологий, адаптивное количество колонок */}
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-8 justify-items-center'>
          {technologies.map((tech, index) => (
            <div
              key={index}
              className='group relative w-[70px] h-[70px] sm:w-[55px] sm:h-[55px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px] transition-all duration-300 hover:scale-110 hover:animate-wiggle'
            >
              <Image
                src={normalizeImagePath(tech?.icon as string | undefined)} // Путь к изображению иконки
                alt={(tech?.alt as string | undefined) ?? ''} // Можно добавить описание для доступности
                fill // Заполняет контейнер полностью
                className='object-contain' // Масштабировать изображение без обрезки внутри блока
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  /* Если изображение не загрузилось, скрыть его */
                }}
              />
              {/* Если по каким-то причинам иконка отсутствует или не загружается */}
              {!tech.icon && (
                <div className='w-full h-full bg-gray-200 rounded-full flex items-center justify-center'>
                  <span className='text-gray-500 text-xs'>?</span>{' '}
                  {/* Значок вопроса */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}