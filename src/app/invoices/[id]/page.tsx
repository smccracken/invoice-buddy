import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '~/db';
import { Customers, Invoices } from '~/db/schema';

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
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  console.log(result);

  if (!result) notFound();

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
}
