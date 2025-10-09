import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteParams {
  params: {
    scope: string;
    filename: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { scope, filename } = params;
    const filePath = path.join(process.cwd(), 'public', 'uploads', scope, filename);
    console.log('Requested file path:', filePath);

    // Проверяем существование файла
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Читаем файл
    const fileBuffer = fs.readFileSync(filePath);

    // Определяем MIME type по расширению
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Возвращаем изображение
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
