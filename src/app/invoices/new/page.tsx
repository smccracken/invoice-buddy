"use client";
import { SyntheticEvent, useState } from "react";
import Form from "next/form";

import { createInvoice } from "~/actions";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import SubmitButton from "~/components/ui/SubmitButton";

export default function NewInvoice() {
  const [state, setState] = useState('ready');

  async function handleSubmit(e: SyntheticEvent) {
    if (state === 'submitting') {
      e.preventDefault();
      return;
    };
    setState('submitting');
  }

  return (
    <main className="flex flex-col h-full gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>

      <Form action={createInvoice} onSubmit={handleSubmit} className="grid gap-4 max-w-xs">
        <div>
          <Label htmlFor="name" className="block mb-2 font-semibold">Customer Name</Label>
          <Input type="text" id="name" name="name" placeholder="Test User" />
        </div>
        <div>
          <Label htmlFor="email" className="block mb-2 font-semibold">Customer Email</Label>
          <Input type="email" id="email" name="email" placeholder="user@example.com" />
        </div>
        <div>
          <Label htmlFor="amount" className="block mb-2 font-semibold">Amount</Label>
          <Input type="text" id="amount" name="amount" placeholder="1,000,000" />
        </div>
        <div>
          <Label htmlFor="description" className="block mb-2 font-semibold">Description</Label>
          <Textarea id="description" name="description" placeholder="Enter your comments here"></Textarea>
        </div>
        <div>
          <SubmitButton />
        </div>
      </Form>
    </main >
  );
}
