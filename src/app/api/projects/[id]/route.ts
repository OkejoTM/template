import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" }, 
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { 
        id: projectId,
        isVisible: true 
      },
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

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message }, 
      { status: 500 }
    );
  }
}