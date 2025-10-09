import type { Config } from 'tailwindcss';
//add sections and  screens size
const config: Config = {
  content: [
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '375px',
      md: '768px',
      lg: '1200px',
      xl: '1500px'

    },
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '20px',
          lg: '80px',
        },
      },
      colors: {
        // Основная палитра
        'light-cards': 'var(--color-light-cards-text)',
        primary: '#58427C', // Основной фиолетовый (header, footer, кнопки)
        accent: '#77C3DD', // Бирюзовый (обводки, акценты)
        gradientStart: '#F2F4F7', // Градиент отзывов (начало)
        gradientEnd: '#ECE7F3', // Градиент отзывов (конец)

        // Тексты и фон
        background: '#F2F0F5', // Фон сайта
        textPrimary: '#2B2B2B', // Заголовки
        textMuted: '#4C484B', // Подписи, описания
        textLight: '#E0E0E0', // Текст на тёмных карточках
        textWhite: '#FFFFFF', // Белый текст
        black: '#000000',

        // Дополнительно
        borderLight: '#DADADA', // Светлая граница
      },
    },
  },
  plugins: [],
};
export default config;
