import { BasePropertyProps, ErrorMessage, RecordJSON } from 'adminjs';
import Ajv, { ErrorObject } from 'ajv';
import {
  githubLightTheme,
  JsonEditor,
  NodeData,
  UpdateFunctionProps,
} from 'json-edit-react';
import React, { useEffect, useMemo, useState } from 'react';
import { definedSchemas } from '../../schemas';
import { convertFlatToNested } from '../utils.js';

const ajv = new Ajv({
  coerceTypes: true,
  allErrors: true,
  useDefaults: true,
});

const RefTableContentEditor: React.FC<BasePropertyProps> = ({
  record,
  onChange,
  where,
}) => {
  const [schema, setSchema] = useState<object | null>(null);
  const name = (record?.params?.name as string) ?? '';
  const rawJsonData = convertFlatToNested(
    record?.params ?? { content: {} }
  ) as Record<string, unknown>;
  const jsonData = rawJsonData['content'];
  const readOnly: boolean = where !== 'edit';

  // Загрузка схемы
  useEffect(() => {
    const newSchema = definedSchemas[name as keyof typeof definedSchemas];
    if (name && newSchema) {
      setSchema(newSchema);
    } else {
      setSchema(null);
    }
  }, [name]);

  const validate = useMemo(() => {
    const emptyValidate: {
      (): boolean;
      errors: ErrorObject[];
    } = () => false;
    emptyValidate.errors = [];

    if (!schema) {
      return emptyValidate;
    }
    try {
      return ajv.compile(schema);
    } catch (e) {
      console.error('Schema compilation error', e);
      return emptyValidate;
    }
  }, [schema]);

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newName = e.target.value;
    onChange?.('name', newName);
  };

  const validateAndChange = (props: UpdateFunctionProps) => {
    const valid = validate(props.newData);
    console.log('Validating', props.newData, '=>', valid);
    if (!valid) {
      console.log('Errors', validate.errors);
      const errorMessage = validate.errors
        ?.map(
          (error) =>
            `${error.instancePath} ${error.propertyName ?? ''} ${error.message}`
        )
        .join('\n');

      onChange?.('content', jsonData, {
        ...record,
        errors: {
          ...record?.errors,
          content: {
            message: 'JSON Schema mismatch',
            type: 'Validation',
          } as ErrorMessage,
        },
      } as RecordJSON);

      return errorMessage;
    }
    onChange?.('content', props.newData);
  };

  const defaultValues = (input: NodeData, newKey?: string) => {
    newKey = newKey ?? '';

    // Если schema нет — возвращаем input как есть
    if (!schema) return input;

    // Определяем контекст: массив или объект
    const path = [...input.path];
    if (newKey.length > 0) path.push(newKey);
    const parentPath = path.slice(0, -1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parentSchema: any = schema;

    // Находим схему для текущего уровня
    for (const key of parentPath) {
      if (!parentSchema) break;
      if (parentSchema.type === 'array') parentSchema = parentSchema.items;
      else if (parentSchema.type === 'object')
        parentSchema = parentSchema.properties?.[key];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createValue = (s: any) => {
      if (!s) return null;

      switch (s.type) {
        case 'object':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const obj: Record<string, any> = {};
          for (const [k, v] of Object.entries(s.properties || {})) {
            const propSchema = v as {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              default?: any;
              type?: string;
              properties?: object;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              enum?: any[];
            };
            obj[k] = propSchema.default ?? createValue(propSchema); // рекурсивно
          }
          return obj;
        case 'array':
          return [];
        case 'string':
          if (s.enum?.length) return s.enum[0]; // первый вариант из enum
          if (s.default !== undefined) return s.default;
          if (s.minLength && s.minLength > 0) return ' '.repeat(s.minLength); // минимально допустимая строка
          return ''; // допустимо пустое значение
        case 'number':
        case 'integer':
          if (s.default !== undefined) return s.default;
          if (s.minimum !== undefined) return s.minimum;
          return 0;
        case 'boolean':
          return s.default ?? false;
        default:
          return null;
      }
    };

    if (parentSchema?.type === 'array') {
      return createValue(parentSchema.items);
    } else if (parentSchema?.type === 'object') {
      const keySchema = parentSchema.properties?.[newKey];
      console.log('Key schema for', newKey, keySchema);
      return createValue(keySchema);
    }

    return null;
  };

  return (
    <div>
      <label style={{ fontWeight: 'bold' }}>Schema name:</label>
      <select
        className='form-control mb-2'
        value={name}
        disabled={readOnly}
        onChange={handleNameChange}
      >
        <option value=''>...</option>
        {Object.keys(definedSchemas).map((schemaName) => (
          <option key={schemaName} value={schemaName}>
            {schemaName}
          </option>
        ))}
      </select>

      {schema ? (
        <JsonEditor
          data={jsonData}
          theme={githubLightTheme}
          indent={4}
          rootName={name}
          viewOnly={readOnly}
          onUpdate={validateAndChange}
          defaultValue={defaultValues}
        />
      ) : (
        <p style={{ color: 'gray' }}>Schema not selected or not found.</p>
      )}
    </div>
  );
};

export default RefTableContentEditor;
