import { BasePropertyProps } from 'adminjs';
import {
  githubLightTheme,
  JsonEditor as ReactJsonEditor,
} from 'json-edit-react';
import React, { useEffect, useState } from 'react';
import { convertFlatToNested } from '../utils.js';

/**
 * Использование:
 * {
 *   propertyName: {
 *     type: 'mixed',
 *     components: {
 *       edit: JsonEditor,
 *       show: JsonEditor,
 *     },
 *   },
 * }
 */
const JsonEditor: React.FC<BasePropertyProps> = ({
  record,
  onChange,
  where,
  property,
}) => {
  const fieldName = property.name; // Название поля
  const rawData = convertFlatToNested(record?.params ?? {}) as Record<
    string,
    unknown
  >;

  let jsonData = rawData[fieldName];

  if (!jsonData) {
    if (
      fieldName.toLowerCase().includes('list') ||
      fieldName.toLowerCase().includes('images') ||
      fieldName.toLowerCase().includes('stack') ||
      fieldName.toLowerCase().includes('array')
    ) {
      jsonData = [];
    } else {
      jsonData = {};
    }
  }

  const readOnly: boolean = where !== 'edit';
  const [data, setData] = useState(jsonData);

  useEffect(() => {
    setData(jsonData);
  }, [JSON.stringify(jsonData)]);

  const handleUpdate = (newData: unknown) => {
    setData(newData);
    onChange?.(fieldName, newData);
  };

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <div
        // style={{
        //   border: '1px solid #e0e0e0',
        //   borderRadius: '8px',
        //   padding: '16px',
        //   backgroundColor: '#f9f9f9',
        //   minHeight: '200px',
        // }}
      >
        <ReactJsonEditor
          data={data}
          setData={handleUpdate}
          theme={githubLightTheme}
          rootName={fieldName}
          collapse={2}
          showArrayIndices={false}
          showCollectionCount={true}
          restrictEdit={readOnly}
          restrictDelete={readOnly}
          restrictAdd={readOnly}
        />
      </div>
    </div>
  );
};

export default JsonEditor;