'use client';
import Form from 'next/form';
import { SyntheticEvent, useState } from 'react';

import { createInvoice } from '~/actions';
import Container from '~/components/Container';
import PageHeader from '~/components/PageHeader';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import SubmitButton from '~/components/ui/SubmitButton';
import { Textarea } from '~/components/ui/textarea';

export default function NewInvoice() {
  const [state, setState] = useState('ready');

  async function handleSubmit(e: SyntheticEvent) {
    if (state === 'submitting') {
      e.preventDefault();
      return;
    }
    setState('submitting');
  }

  return (
    <main>
      <Container>
        <PageHeader>
          <h1 className='text-3xl font-bold'>Create Invoice</h1>
        </PageHeader>

        <Form
          action={createInvoice}
          onSubmit={handleSubmit}
          className='grid gap-4 max-w-xs'
        >
          <div>
            <Label
              htmlFor='name'
              className='block mb-2 font-semibold'
            >
              Customer Name
            </Label>
            <Input
              type='text'
              id='name'
              name='name'
              placeholder='Test User'
            />
          </div>
          <div>
            <Label
              htmlFor='email'
              className='block mb-2 font-semibold'
            >
              Customer Email
            </Label>
            <Input
              type='email'
              id='email'
              name='email'
              placeholder='user@example.com'
            />
          </div>
          <div>
            <Label
              htmlFor='amount'
              className='block mb-2 font-semibold'
            >
              Amount
            </Label>
            <Input
              type='text'
              id='amount'
              name='amount'
              placeholder='1,000,000'
            />
          </div>
          <div>
            <Label
              htmlFor='description'
              className='block mb-2 font-semibold'
            >
              Description
            </Label>
            <Textarea
              id='description'
              name='description'
              placeholder='Enter your comments here'
            ></Textarea>
          </div>
          <div>
            <SubmitButton />
          </div>
        </Form>
      </Container>
    </main>
  );
}
