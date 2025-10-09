import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}