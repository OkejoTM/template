// Функция для преобразования плоской структуры AdminJS в структуру для валидации
export const convertFlatToNested = (obj) => {
  const result = {};

  for (const flatKey in obj) {
    const parts = flatKey.split('.');
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      const isLast = i === parts.length - 1;
      const nextKey = parts[i + 1];
      const isNextIndex = !isLast && !isNaN(Number(nextKey));

      const isIndex = !isNaN(Number(key));
      const keyAsIndex = isIndex ? Number(key) : key;

      if (isLast) {
        // Устанавливаем значение на последнем шаге
        if (Array.isArray(current)) {
          current[keyAsIndex] = obj[flatKey];
        } else {
          current[keyAsIndex] = obj[flatKey];
        }
      } else {
        // Выбираем, что создавать — массив или объект
        if (current[keyAsIndex] === undefined) {
          current[keyAsIndex] = isNextIndex ? [] : {};
        }
        current = current[keyAsIndex];
      }
    }
  }
  return result;
};

export function flattenNestedObject(obj, prefix = '') {
  const result = {};

  // Прямо обрабатываем случай, когда на вход пришёл массив (как корень)
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = prefix ? `${prefix}.${index}` : String(index);
      if (item !== null && typeof item === 'object') {
        Object.assign(result, flattenNestedObject(item, key));
      } else {
        result[key] = item;
      }
    });
    return result;
  }

  // Если не объект (примитив) — возвращаем его под текущим префиксом
  if (obj === null || typeof obj !== 'object') {
    if (prefix !== '') result[prefix] = obj;
    return result;
  }

  // Обычный объект — итерируем только собственные свойства
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrKey = `${prefixedKey}.${index}`;
          if (item !== null && typeof item === 'object') {
            Object.assign(result, flattenNestedObject(item, arrKey));
          } else {
            result[arrKey] = item;
          }
        });
      } else {
        Object.assign(result, flattenNestedObject(value, prefixedKey));
      }
    } else {
      result[prefixedKey] = value;
    }
  }

  return result;
}
