// RefTables JSON Schema
const contactKeys = {
  phone: 'phone',
  vk: 'url',
  telegram: 'url',
  max: 'url',
  whatsapp: 'url',
  email: 'email',
  address: 'address',
  location: 'mapcoords',
  workdays: 'stringpair',
  'dayoff?': 'other',
  workhours: 'timeinterval',
  'breakhours?': 'timeinterval',
};

// Функция для маппинга типа -> schema
function valueSchema(type) {
  switch (type) {
    case 'phone':
    case 'email':
    case 'url':
    case 'address':
    case 'other':
      return { type: 'string' };
    case 'mapcoords':
      return {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      };
    case 'timeinterval':
    case 'stringpair':
      return {
        type: 'array',
        items: { type: 'string' },
        minItems: 2,
        maxItems: 2,
      };
    case 'number':
      return { type: 'number' };
    default:
      return { type: 'string' };
  }
}

export const contacts = {
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(contactKeys).map(([key, type]) => [
      key.replaceAll('?', ''),
      valueSchema(type),
    ])
  ),
  required: Object.keys(contactKeys).filter((key) => !key.endsWith('?')),
  additionalProperties: false,
};

const statsKeys = {
  experienceFromYear: null, // одиночная статистика
  clientCountries: null,
  specialization: ['Backend', 'Frontend', 'DevOps', 'UI/UX'], // массив с объектами
  technologies: ['JavaScript/TypeScript', 'Python', 'Golang', 'C++'],
};

export const stats = {
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(statsKeys).map(([key, nestedKeys]) => {
      if (Array.isArray(nestedKeys)) {
        // Вложенный объект
        return [
          key,
          {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: { type: 'string', enum: nestedKeys },
                value: { type: 'number' },
              },
              required: ['key', 'value'],
              additionalProperties: false,
            },
            uniqueItems: true,
          },
        ];
      } else {
        // Примитивное число
        return [key, { type: 'number' }];
      }
    })
  ),
  additionalProperties: false,
};

export const techstack = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      alt: { type: 'string' },
      image_url: { type: 'string' },
    },
    required: ['alt', 'image_url'],
    additionalProperties: false,
  },
};

export const cases = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      category: { type: 'string' },
      description: { type: 'string' },
      image_url: { type: 'string' },
    },
    required: ['title', 'image_url'],
    additionalProperties: false,
  },
};

export const aspectsList = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' }
    },
    required: ['title', 'description'],
    additionalProperties: false
  }
};

export const definedSchemas = {
  contacts,
  stats,
  techstack,
  cases,
  aspectsList,                 
  galleryImages: techstack,    
  projectTechStack: techstack,
};
