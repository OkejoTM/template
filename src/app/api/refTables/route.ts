import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Получить список всех названий reftables
export async function GET() {
  try {
    const refTables = await prisma.refTable.findMany({
      select: { name: true },
    });
    // Возвращаем массив строк с названиями
    return NextResponse.json(refTables.map(rt => rt.name));
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
