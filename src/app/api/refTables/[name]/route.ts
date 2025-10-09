import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface Params {
  params: { name: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { name } = params;

    const refTable = await prisma.refTable.findUnique({
      where: { name },
      select: { name: true, content: true },
    });

    if (!refTable) {
      return NextResponse.json(
        { message: `RefTable with name "${name}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(refTable);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
