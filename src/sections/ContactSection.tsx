import { useTranslations } from '@/lib/localize';
import { JsonObject } from '@prisma/client/runtime/library';
import Image from 'next/image';
import { FC } from 'react';

interface ContactsSectionProps {
  data: JsonObject;
}

const Contacts: FC<ContactsSectionProps> = ({ data }) => {
  const t = useTranslations('ContactSection');

  const workhours: number[] = (data.workhours as number[]) || [9, 18]; // Default working hours if not provided
  let workdays: string[] = (data.workdays as string[]) || [
    'from_monday',
    'from_friday',
  ];
  const dayoff: string | null = data.dayoff
    ? t('workingHours.' + data.dayoff)
    : null;
  const breakhours: number[] | null = data.breakhours as number[] | null;

  workdays = workdays.map((day) => {
    return t('workingHours.' + day);
  });

  return (
    <section
      className='container bg-site py-12'
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className='max-w-[1200px] mx-auto px-4'>
        {/* Заголовок */}
        <h2 className='text-[36px] font-semibold text-headings mb-8 leading-[100%] md:text-left'>
          {t('title')}
        </h2>

        {/* Контактная информация */}
        <div className='flex flex-col md:flex-row justify-between items-center md:items-start flex-wrap gap-y-8  md:text-left'>
          {/* Левая колонка */}
          <div className='w-full md:w-72 text-[18px] md:text-[20px] font-normal leading-[30px] text-muted'>
            <p>
              {t('workingHours.line1')}
              <br />
              {t('workingHours.from')} {workdays[0] ?? t('from_monday')}{' '}
              {t('workingHours.to_days')} {workdays[1] ?? t('from_friday')}
              <br />
              {dayoff ? t('workingHours.dayoff') + ' - ' + dayoff : ''}
              <br />
              {t('workingHours.from')} {workhours[0] ?? 9}{' '}
              {t('workingHours.to_hours')} {workhours[1] ?? 18}
              <br />
              {breakhours
                ? [
                    t('workingHours.break'),
                    t('workingHours.from'),
                    breakhours[0],
                    t('workingHours.to_hours'),
                    breakhours[1],
                  ].join(' ')
                : ''}
            </p>
          </div>

          {/* Средняя колонка */}
          <div className='w-full md:w-[222px] text-[18px] md:text-[20px] leading-[30px]'>
            <p className='font-semibold text-buttons mb-1'>{t('callUs')}</p>
            <p className='mb-3 text-muted font-normal'>
              {(data.phone as string) ?? ''}
            </p>

            <p className='font-semibold text-buttons mb-1'>{t('writeUs')}</p>
            <p className='mb-3 text-muted font-normal'>
              {(data.email as string) ?? ''}
            </p>

            <p className='font-semibold text-buttons mb-1'>{t('visitUs')}</p>
            <p className='text-muted font-normal'>
              {t(data.address as string) ?? ''}
            </p>
          </div>

          {/* Правая колонка с соцсетями */}
          <div className='w-full md:flex-1 md:max-w-xs'>
            <h3 className='text-[20px] font-semibold mb-2 text-buttons leading-[30px]'>
              {t('socialMedia')}
            </h3>
            <div className='flex justify-center md:justify-start space-x-4 sm:space-x-6'>
              <a
                href={
                  (data.telegram as string)
                    ? `https://t.me/${data.telegram}`
                    : '#'
                }
              >
                <Image
                  src='/icons/contacts_telegram.svg'
                  alt='Telegram'
                  width={60} // Smaller size for mobile
                  height={60} // Smaller size for mobile
                  className='md:w-[65px] md:h-[65px]' // Original size for medium and larger
                />
              </a>
              <a
                href={
                  (data.whatsapp as string)
                    ? `https://wa.me/${data.whatsapp}`
                    : '#'
                }
              >
                <Image
                  src='/icons/contacts_phone.svg'
                  alt='WhatsApp'
                  width={60} // Smaller size for mobile
                  height={60} // Smaller size for mobile
                  className='md:w-[65px] md:h-[65px]' // Original size for medium and larger
                />
              </a>
              <a href={(data.vk as string) ? `https://vk.me/${data.vk}` : '#'}>
                <Image
                  src='/icons/contacts_vk.svg'
                  alt='VK'
                  width={60} // Smaller size for mobile
                  height={60} // Smaller size for mobile
                  className='md:w-[65px] md:h-[65px]' // Original size for medium and larger
                />
              </a>
              <a href={(data.email as string) ? `mailto:${data.email}` : '#'}>
                <Image
                  src='/icons/contacts_email.svg'
                  alt='Email'
                  width={60} // Smaller size for mobile
                  height={60} // Smaller size for mobile
                  className='md:w-[65px] md:h-[65px]' // Original size for medium and larger
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
