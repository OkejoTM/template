import uploadFeature, { BaseProvider } from '@adminjs/upload';
import fs from 'fs';
import path from 'path';
import componentLoader from './component-loader.js';

const uploadDir = 'public';

import { promisify } from 'util';

const rename = promisify(fs.rename);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

class CustomLocalProvider extends BaseProvider {
  constructor(bucket) {
    super(bucket);
    this.bucket = bucket;
  }

  async upload(file, key) {
    const filePath = key.replaceAll('api/', 'public/');
    const dirPath = path.join(this.bucket, 'uploads'); // директория, куда будем сохранять

    try {
      await mkdir(dirPath, { recursive: true });
      await rename(file.path, filePath);
    } catch (err) {
      if (err.code === 'EXDEV') {
        await copyFile(file.path, filePath);
        await unlink(file.path);
      } else {
        throw err;
      }
    }
  }

  async delete(key, bucket) {
    const filePath = path.join(bucket, key);
    try {
      await unlink(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  path(key, bucket) {
    return `${bucket}/${key}`;
  }
}

export function makeUploadFeature(dbField, scope) {
  return uploadFeature({
    componentLoader,
    provider: new CustomLocalProvider(uploadDir),
    properties: {
      key: dbField,
      file: 'uploadImage',
    },
    uploadPath: (record, filename) => {
      const ext = path.extname(filename);
      return `api/uploads/${scope}/${record.id()}${ext}`;
    },
    validation: {
      mimeTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
        'image/gif',
      ],
      maxSize: 5 * 1024 * 1024,
    },
  });
}
