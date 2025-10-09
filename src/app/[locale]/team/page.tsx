import { prisma } from '@/lib/prisma';
import Collaboration from '@/sections/CollaborationSection';
import TeamSection from '@/sections/TeamSection';
import TeamStats from '@/sections/TeamStats';
import { JsonObject } from '@prisma/client/runtime/library';

export const revalidate = 0;

export default async function Team() {
  const stats = await prisma?.refTable.findFirst({ where: { name: 'stats' } });
  
  const teamMembers = await prisma?.employee.findMany({
    where: { isVisible: true },
    orderBy: { id: 'asc' },
  });
  const projects = await prisma?.project.count();

  if (stats && stats.content) {
    (stats.content as JsonObject).staffCount = teamMembers?.length ?? 0;
    (stats.content as JsonObject).successfulProjects = projects;
  }

  return (
    <>
      <TeamStats data={stats} />
      <TeamSection data={teamMembers} />
      <Collaboration />
    </>
  );
}
