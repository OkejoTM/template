import { prisma } from '@/lib/prisma';
import DevelopmentProcessSection from '@/sections/DevelopmentProcessSection';
import Cases from '@/sections/ExtendedCasesSection';
import TechnologiesSection from '@/sections/TechnologiesSection';

export const revalidate = 0;

export default async function Portfolio() {

    const projects = await prisma.project.findMany({
        where: { isVisible: true },
        orderBy: { startDate: 'desc' },
        include: {
            direction: true
        }
    });

    const techstack = await prisma?.refTable.findFirst({
        where: { name: 'techstack' },
    });

    return (
        <>
            <DevelopmentProcessSection />
            <Cases data={projects} />
            <TechnologiesSection data={techstack} />
        </>
    );
}