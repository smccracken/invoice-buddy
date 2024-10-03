import { eq } from "drizzle-orm/expressions";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { db } from "~/db";
import { Invoices } from "~/db/schema";
import { cn } from "~/lib/utils";


export default async function InvoiceDetail({ params }: { params: { id: string } }) {
  const invoiceId = parseInt(params.id);
  const [result] = await db.select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  return (
    <main className="max-w-5xl mx-auto my-12">
      <Link href="/invoices">Invoices</Link>
      <div className="flex flex-col justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-4  mb-8">
          Invoice {invoiceId}
          <Badge className={cn(
            "capitalize rounded-full",
            result.status === 'open' && 'bg-blue-500',
            result.status === 'paid' && 'bg-green-600',
            result.status === 'void' && 'bg-zinc-700',
            result.status === 'overdue' && 'bg-red-600',
          )}>{result.status}</Badge>
        </h1>
        <p className="text-3xl mb-3">${(result.amount / 100).toFixed(2)}</p>

        <p className="text-lg mb-8">{result.description}</p>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{result.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(result.created_at).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Customer Name
            </strong>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Customer Email
            </strong>
          </li>
        </ul>
      </div>
    </main>
  );
}
