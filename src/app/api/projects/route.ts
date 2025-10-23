import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // получаем данные от клиента

    const { name, image, startDate, isVisible, partnerId, directionId,
      heroContent, calloutContent, aspectsList, galleryImages, projectTechStack
    } = body; // формируем поля для записи

    const newProject = await prisma.project.create({
      data: {
        name,
        imagePath: image,
        startDate,
        isVisible,
        partnerId,
        directionId,
        heroContent,
        calloutContent,
        aspectsList,
        galleryImages,
        projectTechStack,
      },
      include:{
        partner: true,
        direction: true,
        employees: {
          include: {
            employee: true
          }
        }
      } 
    }); // делаем запись в бд

    const projectResponse = {
      id: newProject.id,
      name: newProject.name,
      image: newProject.imagePath,
      startDate: newProject.startDate,
      isVisible: newProject.isVisible,
      partnerId: newProject.partnerId,
      directionId: newProject.directionId,
      heroContent: newProject.heroContent,
      calloutContent: newProject.calloutContent,
      aspectsList: newProject.aspectsList,
      galleryImages: newProject.galleryImages,
      projectTechStack: newProject.projectTechStack,
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
    const projects = await prisma.project.findMany({
      include: {
        partner: true,
        direction: true,
        employees: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imagePath: true,
                role: true,
                nickname: true,
                description: true
              }
            }
          }
        }
      }
    });
    return NextResponse.json(projects);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
