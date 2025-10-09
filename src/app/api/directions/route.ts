import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json(); // получаем данные из бд

    const { name, duration_days } = body;

    if (!name || !duration_days) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newDirection = await prisma.devDirection.create({
      data: {
        rawName: name,
        durationDays: duration_days,
      },
    });

    const directionResponse = {
      id: newDirection.id,
      rawName: newDirection.rawName,
      duration_days: newDirection.durationDays,
      createdAt: newDirection.createdAt,
      updatedAt: newDirection.updatedAt,
    };

    return NextResponse.json(directionResponse);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const directions = await prisma.devDirection.findMany();
    return NextResponse.json(directions);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
