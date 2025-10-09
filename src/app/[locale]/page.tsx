// Главная страница

import { getDynamicTranslations } from '@/lib/dynamicTranslations';
import { prisma } from '@/lib/prisma';
import CasesSection from '@/sections/CasesSection';
import DevelopmentDirectionsSection from '@/sections/DevelopmentDirectionsSection';
import Hero from '@/sections/Hero';
import Partners from '@/sections/PartnerSection';
import ReviewSection from '@/sections/ReviewSection';
import { getLocale } from 'next-intl/server';

export const revalidate = 0;

export default async function Home() {
  const locale = await getLocale();

  // Берём все devDirections (ключи)
  const devDirections = await prisma.devDirection.findMany();
  // Берём все локализации по ключам и текущему языка
  const rawNames = devDirections.map((d) => d.rawName);
  const localizations = await prisma.localization.findMany({
    where: {
      section: { in: ['devdirections', 'devdirections_description'] },
      localeCode: locale,
      rawName: { in: rawNames },
    },
  });

  // получает переведённое название из translations по raw_name
  const nameMap = new Map(
      localizations
          .filter((l) => l.section === 'devdirections')
          .map((l) => [l.rawName, l.content])
  );
  // получает переведённое описание из translations по raw_name
  const descMap = new Map(
      localizations
          .filter((l) => l.section === 'devdirections_description')
          .map((l) => [l.rawName, l.content])
  );
  // переведённое поля name, description
  const devDirectionsLocalized = devDirections.map((d) => ({
    name: nameMap.get(d.rawName) ?? d.rawName,
    description: descMap.get(d.rawName) ?? null,
    imagePath: d.imagePath,
  }));

  // Получаем проекты напрямую как массив
    const projects = await prisma.project.findMany({
        where: { isVisible: true },
        include: { direction: true },
        orderBy: { startDate: 'desc' }
    });
  const partners = await prisma?.partner.findMany();
  const reviews = await prisma?.review.findMany();

  const dynamicTranslate = await getDynamicTranslations('reviews');

  const translatedReviews = [];
  // Цикл необходим для того, чтобы переводы происходили последовательно.
  // Переводчик может не поддерживать несколько запросов одновременно
  for (const review of reviews) {
    const translatedReview = {
      ...review,
      description: await dynamicTranslate(
          {
            id: review.id,
            sourceMessage: review.description ?? '',
            sourceLocale: review.userLocale,
          },
          locale
      ),
    };
    translatedReviews.push(translatedReview);
  }

  return (
      <>
        <Hero />
        <DevelopmentDirectionsSection data={devDirectionsLocalized} />
        <CasesSection data={projects} />
        <Partners data={partners} />
        <ReviewSection data={translatedReviews} />
      </>
  );
}