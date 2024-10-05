'use server';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '~/db';
import { Invoices, Status } from '~/db/schema';

export async function createInvoice(formData: FormData) {
  const { userId } = auth();
  const amount = Math.floor(parseFloat(String(formData.get('amount'))) * 100);
  const description = formData.get('description') as string;

  if (!userId) return;

  const results = await db
    .insert(Invoices)
    .values({
      amount,
      description,
      userId,
      status: 'open',
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId } = auth();
  const id = parseInt(formData.get('id') as string);
  const status = formData.get('status') as Status;

  if (!userId) return;

  await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, id), eq(Invoices.userId, userId)));

  revalidatePath('/invoices/${id}', 'page');
}
