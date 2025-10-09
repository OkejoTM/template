import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // получаем данные от клиента

    const { name, image, startDate, isVisible, partnerId, directionId } = body; // формируем поля для записи

    const newProject = await prisma.project.create({data: {
      name,
      imagePath: image,
      startDate,
      isVisible,
      partnerId,
      directionId,
    }}); // делаем запись в бд

    const projectResponse = {
      id: newProject.id,
      name: newProject.name,
      image: newProject.imagePath,
      startDate: newProject.startDate,
      isVisible: newProject.isVisible,
      partnerId: newProject.partnerId,
      directionId: newProject.directionId,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
    }; // создаем форму ответа

    return NextResponse.json(projectResponse); // возвращаем данные
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany(); // ищем все данные в бд
    return NextResponse.json(projects); // возвращаем
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
