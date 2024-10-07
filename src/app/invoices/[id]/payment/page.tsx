import { eq } from 'drizzle-orm';
import { Check, CreditCard } from 'lucide-react';
import Stripe from 'stripe';

import Container from '~/components/Container';
import { Badge } from '~/components/ui/badge';
import { Customers, Invoices } from '~/db/schema';
import { cn } from '~/lib/utils';

import { Button } from '~/components/ui/button';

import { notFound } from 'next/navigation';
import { createPayment, updateStatusAction } from '~/actions';
import { db } from '~/db';

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

interface InvoicePageProps {
  params: { invoiceId: string };
  searchParams: {
    status: string;
    session_id: string;
  };
}

export default async function InvoicePage({
  params,
  searchParams,
}: InvoicePageProps) {
  const invoiceId = Number.parseInt(params.id);

  if (Number.isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID');
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      created_at: Invoices.created_at,
      description: Invoices.description,
      amount: Invoices.amount,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className='w-full h-full'>
      <Container>
        <div className='grid grid-cols-2'>
          <div>
            <div className='flex justify-between mb-8'>
              <h1 className='flex items-center gap-4 text-3xl font-semibold'>
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    'rounded-full capitalize',
                    invoice.status === 'open' && 'bg-blue-500',
                    invoice.status === 'paid' && 'bg-green-600',
                    invoice.status === 'void' && 'bg-zinc-700',
                    invoice.status === 'uncollectible' && 'bg-red-600'
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>
            <p className='text-3xl mb-3'>
              ${(invoice.amount / 100).toFixed(2)}
            </p>
            <p className='text-lg mb-8'>{invoice.description}</p>
          </div>
          <div>
            <h2 className='text-xl font-bold mb-4'>Manage Invoice</h2>
            {invoice.status === 'open' && (
              <form action={createPayment}>
                <input
                  type='hidden'
                  name='id'
                  value={invoice.id}
                />
                <Button className='flex gap-2 font-bold bg-green-700'>
                  <CreditCard className='w-5 h-auto' />
                  Pay This Invoice
                </Button>
              </form>
            )}
            {invoice.status === 'paid' && (
              <p className='flex gap-2 items-center text-xl font-bold'>
                <Check className='w-6 h-auto bg-green-700 rounded-full text-white p-1' />
                Invoice paid
              </p>
            )}
          </div>

          <h2 className='font-bold text-lg mb-4'>Billing Details</h2>
          <ul className='grid gap-2'>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Invoice ID
              </strong>
              <span>{invoice.id}</span>
            </li>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Invoice Date
              </strong>
              <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
            </li>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Billing Name
              </strong>
              <span>{invoice.customer.name}</span>
            </li>
          </ul>
        </div>
      </Container>
    </main>
  );
}
