import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isVisible: true },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(services);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rawName, isVisible = true, sortOrder = 0 } = body;

    if (!rawName) {
      return NextResponse.json(
        { message: "Missing required field: rawName" },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        rawName,
        isVisible,
        sortOrder,
      },
    });

    return NextResponse.json(newService);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message }, 
      { status: 500 }
    );
  }
}
