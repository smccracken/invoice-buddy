'use client';
import { useOptimistic } from 'react';

import Link from 'next/link';
import Container from '~/components/Container';
import PageHeader from '~/components/PageHeader';
import { Badge } from '~/components/ui/badge';
import { Invoices } from '~/db/schema';
import { cn } from '~/lib/utils';

import { ChevronDown, Ellipsis, Trash2 } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { deleteInvoiceAction, updateStatusAction } from '~/actions';
import { AVAILABLE_STATUSES } from '~/data/invoices';

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect;
}

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (status, newStatus) => {
      return String(newStatus);
    }
  );

  async function handleStatusUpdate(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get('status'));
    try {
      await updateStatusAction(formData);
    } catch (e) {
      setCurrentStatus(originalStatus);
      console.error(e);
    }
  }
  return (
    <main>
      <Container>
        <Link href='/invoices'>Invoices</Link>
        <PageHeader>
          <h1 className='text-3xl font-bold flex items-center'>
            Invoice {invoice.id}
            <Badge
              className={cn(
                'capitalize rounded-full',
                currentStatus === 'open' && 'bg-blue-500',
                currentStatus === 'paid' && 'bg-green-600',
                currentStatus === 'void' && 'bg-zinc-700',
                currentStatus === 'overdue' && 'bg-red-600'
              )}
            >
              {currentStatus}
            </Badge>
          </h1>
          <div className='flex gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  Change Status
                  <ChevronDown className='h-auto w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AVAILABLE_STATUSES.map((status) => {
                  return (
                    <DropdownMenuItem key={status.id}>
                      <form action={handleStatusUpdate}>
                        <input
                          type='hidden'
                          name='id'
                          value={invoice.id}
                        />
                        <input
                          type='hidden'
                          name='status'
                          value={status.id}
                        />
                        <button className='w-full'>{status.label}</button>
                      </form>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='flex items-center gap-2'
                  >
                    <span className='sr-only'>More Options</span>
                    <Ellipsis className='h-auto w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <DialogTrigger className='flex gap-2 items-center'>
                      Delete Invoice
                      <Trash2 className='w-4 h-auto' />
                    </DialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className='text-2xl'>
                    Delete Invoice?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your invoice and remove your data from our servers.
                  </DialogDescription>
                  <DialogFooter>
                    <form
                      action={deleteInvoiceAction}
                      className='w-full flex justify-center gap-2'
                    >
                      <input
                        type='hidden'
                        name='id'
                        value={invoice.id}
                      />
                      <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                      </DialogClose>
                      <Button
                        variant='destructive'
                        className='flex gap-2 items-center'
                      >
                        Delete Invoice
                        <Trash2 className='w-4 h-auto' />
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </PageHeader>
        <div className='flex flex-col justify-between'>
          <p className='text-3xl mb-3'>${(invoice.amount / 100).toFixed(2)}</p>

          <p className='text-lg mb-8'>{invoice.description}</p>

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
                Customer Name
              </strong>
            </li>
            <li className='flex gap-4'>
              <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
                Customer Email
              </strong>
            </li>
          </ul>
        </div>
      </Container>
    </main>
  );
}
