import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, timeZone } from "@/config";
import { prisma } from "@/lib/prisma";
import deepmerge from 'deepmerge';

// Интерфейс данных из БД
interface LocalizationData {
  section: string;
  rawName: string;
  localeCode: string;
  content: string;
}

interface NestedLocalizationObject {
  [key: string]: string | NestedLocalizationObject;
}

/**
 * Функция превращает плоский массив переводов в вложенную структуру
 * Например: [{ section: "Hero", rawName: "title", content: "Заголовок" }]
 * Превращается в: { Hero: { title: "Заголовок" } }
 */
const buildMessages = (localizations: LocalizationData[]): NestedLocalizationObject => {
  const messages: NestedLocalizationObject = {};
  
  localizations.forEach((localization) => {
    // Создаем полный путь: section.rawName
    const fullKey = `${localization.section}.${localization.rawName}`;
    const keys = fullKey.split(".");
    let currentLevel = messages;
    
    // Проходим по каждому уровню вложенности
    keys.forEach((key, index) => {
      if (index < keys.length - 1) {
        // Если это не последний ключ - создаем объект
        if (!currentLevel[key] || typeof currentLevel[key] !== "object") {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      } else {
        // Если последний ключ - записываем значение
        currentLevel[key] = localization.content;
      }
    });
  });
  
  return messages;
};

/**
 * Загружает переводы из JSON файла
 * Возвращает пустой объект если файл не найден (graceful degradation)
 */
const loadFromJSON = async (locale: string): Promise<NestedLocalizationObject> => {
  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return messages || {};
  } catch (error) {
    // ← ИСПРАВЛЕНИЕ: более детальная обработка ошибки
    console.warn(`JSON переводы не найдены для локали: ${locale}`);
    if (error instanceof Error) {
      console.error('Детали ошибки JSON:', error.message);
    }
    return {};
  }
};

/**
 * Загружает переводы из базы данных
 * Возвращает пустой объект при ошибке (graceful degradation)  
 */
const loadFromDatabase = async (locale: string): Promise<NestedLocalizationObject> => {
  try {
    const localizations = await prisma.localization.findMany({
      where: {
        localeCode: locale,
      },
      select: {
        section: true,
        rawName: true,
        localeCode: true,
        content: true,
      },
    });
    
    return buildMessages(localizations);
  } catch (error) {
    console.warn(`БД переводы не удалось загрузить для локали: ${locale}`);
    console.error('Детали ошибки БД:', error);
    return {};
  }
};

/**
 * Создает аварийные переводы если все источники недоступны
 * Показывает ключ перевода вместо пустого места
 */
const createEmergencyFallback = (locale: string): NestedLocalizationObject => {
  return {
    Header: {
      title: "GrapeLab",
      cases: locale === 'ru' ? 'Кейсы' : 'Cases',
      team: locale === 'ru' ? 'Команда' : 'Team',
      contacts: locale === 'ru' ? 'Контакты' : 'Contacts',
    },
    Hero: {
      title: locale === 'ru' ? 'Разработка ПО' : 'Software Development',
      button: locale === 'ru' ? 'Связаться' : 'Contact Us',
    },
    NotFound: {
      errorMessage: locale === 'ru' ? 'Страница не найдена' : 'Page not found',
    }
  };
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Получаем локаль из request (новый API next-intl)
  const locale = await requestLocale;
  
  // Проверяем что локаль поддерживается
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  try {
    console.log(`Загружаем переводы для локали: ${locale}`);
    
    // Загружаем все источники параллельно
    const [
      defaultMessages,  // Английские переводы как базовые
      jsonMessages,     // JSON файл для текущей локали  
      dbMessages        // Переводы из БД
    ] = await Promise.all([
      loadFromJSON('en'),    // Всегда загружаем английский как fallback
      loadFromJSON(locale),  // JSON для текущей локали
      loadFromDatabase(locale) // БД для текущей локали
    ]);

    // Создаем fallback-цепочку с правильным приоритетом
    // deepmerge объединяет объекты, более поздние перезаписывают ранние
    const messages = deepmerge.all([
      defaultMessages,     // 1. Базовый русский (самый низкий приоритет)
      jsonMessages,        // 2. JSON файл (средний приоритет) 
      dbMessages           // 3. База данных (высший приоритет)
    ]);

    console.log(`Переводы загружены. JSON ключей: ${Object.keys(jsonMessages).length}, БД ключей: ${Object.keys(dbMessages).length}`);
    
    return {
      locale,
      timeZone,
      messages,
    };
    
  } catch (error) {
    console.error(`Критическая ошибка загрузки переводов для ${locale}:`);
    if (error instanceof Error) {
      console.error('Сообщение ошибки:', error.message);
      console.error('Стек ошибки:', error.stack);
    } else {
      console.error('Неизвестная ошибка:', error);
    }
    
    // В случае ошибки возвращаем хотя бы что-то
    return {
      locale,
      timeZone, 
      messages: createEmergencyFallback(locale),
    };
  }
});