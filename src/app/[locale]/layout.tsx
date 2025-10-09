import IntlClientProvider from '@/components/IntlClientProvider';
import { locales } from '@/config';
import { prisma } from '@/lib/prisma';
import Footer from '@/sections/Footer';
import Header from '@/sections/Header';
import { JsonObject } from '@prisma/client/runtime/library';
import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const defaultFont = Montserrat({
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'GrapeLab',
  description: 'A laboratory that provides IT solutions that work',
  icons: {
    icon: '/favicon.ico',
  },
};

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<Props>) {
  const messages = await getMessages({ locale });
  const refTable = await prisma?.refTable.findFirst({
    where: { name: 'contacts' },
  });
  const contacts = refTable?.content as JsonObject;

  return (
    <html
      lang={locale}
      className={`${defaultFont.className} overflow-x-hidden`}
    >
      <body className={`antialiased bg-site text-primary overflow-x-hidden`}>
        <div className='content max-w-full overflow-x-hidden'>
          <IntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Footer data={contacts} />
          </IntlClientProvider>
        </div>
      </body>
    </html>
  );
}
