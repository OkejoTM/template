"use client";

import { useEffect, useRef, useState } from "react";

import ComputerIcon from '../../public/icons/pc.png';
import RocketIcon from '../../public/icons/rocket.png';
import TeamIcon from '../../public/icons/team.png';
import WorldIcon from '../../public/icons/world.png';

import { RefTable } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import Image from 'next/image';
import { useTranslations } from '@/lib/localize';

interface TeamStatsProps {
  data: RefTable | null | undefined;
}

export default function TeamStats({ data }: TeamStatsProps) {
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    countries: 0,
    team: 0,
  });

  const t = useTranslations('TeamStats');

  const statsObj = data?.content as JsonObject;
  const experience = new Date().getFullYear() - (statsObj?.experienceFromYear as number);
  const specialization = statsObj?.specialization as Array<{
    key: string;
    value: number;
  }>;
  const technologies = statsObj?.technologies as Array<{
    key: string;
    value: number;
  }>;

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateNumber(
            0,
            (experience) ?? 0,
            (value) => setCounters((prev) => ({ ...prev, experience: value }))
          );
          animateNumber(
            0,
            (statsObj?.successfulProjects as number) ?? 0,
            (value) => setCounters((prev) => ({ ...prev, projects: value }))
          );
          animateNumber(
            0,
            (statsObj?.clientCountries as number) ?? 0,
            (value) => setCounters((prev) => ({ ...prev, countries: value }))
          );
          animateNumber(0, (statsObj?.staffCount as number) ?? 0, (value) =>
            setCounters((prev) => ({ ...prev, team: value }))
          );
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateNumber = (
    start: number,
    end: number,
    callback: (value: number) => void
  ) => {
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const value = Math.floor(progress * (end - start) + start);

      callback(value);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  return (
    <div className='container px-4 py-16 bg-background' ref={sectionRef}>
      <div className='mx-auto max-w-[1200px]'>
        {' '}
        {/* Adjusted for responsiveness */}
        <h2 className='text-[32px] font-semibold mb-16 text-textPrimary'>
          {t('title')}
        </h2>
        {/* Верхний ряд - 4 карточки с цифрами */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 mb-16'>
          {' '}
          {/* Adjusted for responsiveness */}
          {/* Карточка 1 - Опыт */}
          <div className='bg-gradient-to-r from-primary to-accent rounded-[24px] p-[2px]'>
            <div className='bg-background rounded-[24px] p-8 h-full flex flex-col items-center'>
              <div className='bg-gradient-to-r from-primary to-accent rounded-full w-24 h-24 p-[2px] mb-4'>
                <div className='bg-background rounded-full w-full h-full flex items-center justify-center'>
                  <Image
                    src={ComputerIcon}
                    alt='Computer'
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <div className='text-primary text-[48px] font-bold mb-2'>
                {counters.experience}
              </div>
              <div className='text-textMuted text-lg text-center'>
                {t('experience')}
              </div>
            </div>
          </div>
          {/* Карточка 2 - Проекты */}
          <div className='bg-gradient-to-r from-primary to-accent rounded-[24px] p-[2px]'>
            <div className='bg-background rounded-[24px] p-8 h-full flex flex-col items-center'>
              <div className='bg-gradient-to-r from-primary to-accent rounded-full w-24 h-24 p-[2px] mb-4'>
                <div className='bg-background rounded-full w-full h-full flex items-center justify-center'>
                  <Image src={RocketIcon} alt='Rocket' width={48} height={48} />
                </div>
              </div>
              <div className='text-primary text-[48px] font-bold mb-2'>
                {counters.projects}
              </div>
              <div className='text-textMuted text-lg text-center'>
                {t('projects')}
              </div>
            </div>
          </div>
          {/* Карточка 3 - Страны */}
          <div className='bg-gradient-to-r from-primary to-accent rounded-[24px] p-[2px]'>
            <div className='bg-background rounded-[24px] p-8 h-full flex flex-col items-center'>
              <div className='bg-gradient-to-r from-primary to-accent rounded-full w-24 h-24 p-[2px] mb-4'>
                <div className='bg-background rounded-full w-full h-full flex items-center justify-center'>
                  <Image src={WorldIcon} alt='World' width={48} height={48} />
                </div>
              </div>
              <div className='text-primary text-[48px] font-bold mb-2'>
                {counters.countries}
              </div>
              <div className='text-textMuted text-lg text-center'>
                {t('countries')}
              </div>
            </div>
          </div>
          {/* Карточка 4 - Команда */}
          <div className='bg-gradient-to-r from-primary to-accent rounded-[24px] p-[2px]'>
            <div className='bg-background rounded-[24px] p-8 h-full flex flex-col items-center'>
              <div className='bg-gradient-to-r from-primary to-accent rounded-full w-24 h-24 p-[2px] mb-4'>
                <div className='bg-background rounded-full w-full h-full flex items-center justify-center'>
                  <Image src={TeamIcon} alt='Team' width={48} height={48} />
                </div>
              </div>
              <div className='text-primary text-[48px] font-bold mb-2'>
                {counters.team}
              </div>
              <div className='text-textMuted text-lg text-center'>
                {t('teamMembers')}
              </div>
            </div>
          </div>
        </div>
        {/* Нижний ряд - 2 большие карточки с уровнями */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {' '}
          {/* Adjusted for responsiveness */}
          {/* Карточка 1 - Специализация */}
          <div className='bg-gradient-to-r from-primary to-accent rounded-[24px] p-[2px]'>
            <div className='bg-background rounded-[24px] p-8 h-full'>
              <h3 className='text-primary text-[20px] font-bold mb-6'>
                {t('specialization')}
              </h3>

              <div className='space-y-4'>
                {specialization.map((item, index) => (
                  <div key={index}>
                    <div className='flex justify-between text-textMuted text-sm mb-1'>
                      <span>{item.key}</span>
                      <span>{Math.floor((item.value as number) * 100)}%</span>
                    </div>
                    <div className='h-2 bg-gray-200 rounded-full'>
                      <div
                        className='h-2 bg-gradient-to-r from-primary to-accent rounded-full'
                        style={{
                          width: Math.floor((item.value as number) * 100) + '%',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Карточка 2 - Технологии */}
          <div className='bg-gradient-to-r from-primary to-accent rounded-[24px] p-[2px]'>
            <div className='bg-background rounded-[24px] p-8 h-full'>
              <h3 className='text-primary text-[20px] font-bold mb-6'>
                {t('technologys')}
              </h3>

              <div className='space-y-4'>
                {technologies.map((item, index) => (
                  <div key={index}>
                    <div className='flex justify-between text-textMuted text-sm mb-1'>
                      <span>{item.key}</span>
                      <span>{Math.floor((item.value as number) * 100)}%</span>
                    </div>
                    <div className='h-2 bg-gray-200 rounded-full'>
                      <div
                        className='h-2 bg-gradient-to-r from-primary to-accent rounded-full'
                        style={{
                          width: Math.floor((item.value as number) * 100) + '%',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}