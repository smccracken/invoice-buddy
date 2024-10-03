import { createInvoice } from "~/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function NewInvoice() {
  return (
    <main className="flex flex-col h-full gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>

      <form action={createInvoice} className="grid gap-4 max-w-xs">
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
          <Button className="w-full font-semibold">Submit</Button>
        </div>
      </form>
    </main >
  );
}
