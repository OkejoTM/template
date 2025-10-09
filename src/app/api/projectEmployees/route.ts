import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // получаем данные от клиента

    const { projectId, employeeId } = body; // формируем поля для записи

    const newProjectEmployee = await prisma.projectEmployee.create({data: {
      projectId,
      employeeId,
    }}); // делаем запись в бд

    const projectEmployeeResponse = {
      projectId: newProjectEmployee.projectId,
      employeeId: newProjectEmployee.employeeId,
      createdAt: newProjectEmployee.createdAt,
      updatedAt: newProjectEmployee.updatedAt,
    }; // создаем форму ответа

    return NextResponse.json(projectEmployeeResponse); // возвращаем данные
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projectEmployees = await prisma.projectEmployee.findMany(); // ищем все данные в бд
    return NextResponse.json(projectEmployees); // возвращаем
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
