import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '~/db';
import { Invoices } from '~/db/schema';

import Invoice from './invoice';

export default async function InvoiceDetail({
  params,
}: {
  params: { id: string };
}) {
  const invoiceId = parseInt(params.id);
  const { userId } = auth();

  if (!userId) return;

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID');
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) notFound();

  return <Invoice invoice={result} />;
}
