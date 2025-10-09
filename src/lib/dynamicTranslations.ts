import { translationProvider } from '@/config';
import { prisma } from '@/lib/prisma';
import translate from 'translate';
import { xxHash32 } from 'js-xxhash';

translate.engine = translationProvider;
const seed = 0xcafe;

interface DynamicTranslationConsumer {
  id: number;
  sourceMessage: string;
  sourceLocale: string | null;
}

// Лучше писать для scope имя таблицы для которой она предназначена
export async function getDynamicTranslations(scope: string) {
  const bufferedTranslations = await prisma.dynamicTranslationBuffer.findMany({
    where: {
      scope: scope
    },
  });

  return async (
    obj: DynamicTranslationConsumer,
    targetLocaleCode: string = 'en'
  ) => {
    if (obj.sourceLocale == targetLocaleCode || !obj.sourceMessage) {
        return obj.sourceMessage;
    }
    const bufferedTranslation = bufferedTranslations.filter((buf) => buf.sourceId == obj.id && buf.localeCode == targetLocaleCode).at(0);

    const originalHash = xxHash32(obj.sourceMessage, seed).toString(10);
    if (
      !bufferedTranslation ||
      originalHash !== bufferedTranslation.originalMessageHash
    ) {
      if (bufferedTranslation && bufferedTranslation.id) {
        await prisma.dynamicTranslationBuffer.delete({
          where: { id: bufferedTranslation.id },
        });
      }
      const translated = await translate(
        obj.sourceMessage,
        obj.sourceLocale
          ? {
              from: obj.sourceLocale,
              to: targetLocaleCode,
            }
          : targetLocaleCode
      );
      console.log('Creating new translation for review with id: ' + obj.id);
      await prisma.dynamicTranslationBuffer.create({
        data: {
          message: translated,
          scope: scope,
          sourceId: obj.id,
          originalMessageHash: originalHash,
          localeCode: targetLocaleCode,
        },
      });
      return translated;
    }
    return bufferedTranslation.message;
  };
}
