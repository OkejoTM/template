import { prisma } from '@/lib/prisma';
import ContactSection from '@/sections/ContactSection';
import MapSection from '@/sections/MapSection';
import { JsonObject } from '@prisma/client/runtime/library';

export const revalidate = 0;

export default async function Contacts() {
  const refTable = await prisma?.refTable.findFirst({
    where: { name: 'contacts' },
  });
  const contacts = refTable?.content as JsonObject;

  return (
    <>
      <ContactSection data={contacts} />
      <MapSection />
    </>
  );
}
