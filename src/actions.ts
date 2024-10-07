'use server';
import { auth } from '@clerk/nextjs/server';
import { and, eq, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { db } from '~/db';
import { Customers, Invoices, Status } from '~/db/schema';

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

export async function createInvoice(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const amount = Math.floor(parseFloat(String(formData.get('amount'))) * 100);
  const description = formData.get('description') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      amount,
      description,
      userId,
      customerId: customer.id,
      status: 'open',
      organizationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = auth();
  const id = parseInt(formData.get('id') as string);
  const status = formData.get('status') as Status;

  if (!userId) return;

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(and(eq(Invoices.id, id), eq(Invoices.organizationId, orgId)));
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, id),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  revalidatePath('/invoices/${id}', 'page');
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = auth();
  const id = parseInt(formData.get('id') as string);

  if (!userId) return;

  if (orgId) {
    await db
      .delete(Invoices)
      .where(and(eq(Invoices.id, id), eq(Invoices.organizationId, orgId)));
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, id),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  redirect('/invoices/');
}

export async function createPayment(formData: FormData) {
  const headersList = headers();
  const origin = headersList.get('origin');
  const id = parseInt(formData.get('id') as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      amount: Invoices.amount,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'usd',
          product: `prod_QzFfVQfoIxlqhF`,
          unit_amount: result.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/invoices/${id}/payment/?success=true`,
    cancel_url: `${origin}/invoices/${id}/payment/?canceled=true`,
  });

  if (!session.url) {
    throw new Error('Invalid session');
  }
  redirect(session.url);
}
