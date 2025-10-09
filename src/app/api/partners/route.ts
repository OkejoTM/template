import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const partners = await prisma.partner.findMany(); // ищем все данные в бд
    return NextResponse.json(partners); // возвращаем
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
