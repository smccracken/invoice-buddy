import { db } from "~/db";
import { Invoices } from "~/db/schema";

import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { cn } from "~/lib/utils";


export default async function Dashboard() {
  const results = await db.select().from(Invoices);

  return (
    <main className="flex flex-col h-full text-center gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="ghost" className="inline-flex gap-1" asChild>
          <Link href="/invoices/new">
            <CirclePlus className="h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-[100px] px-4 py-2">Date</TableHead>
            <TableHead className="text-left px-4 py-2">Customer</TableHead>
            <TableHead className="text-left px-4 py-2">Email</TableHead>
            <TableHead className="text-center px-4 py-2">Status</TableHead>
            <TableHead className="text-right px-4 py-2">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map(result => {
            return <TableRow key={result.id}>
              <TableCell className="text-left font-medium p-0"><Link href={`/invoices/${result.id}`} className="block font-semibold p-4"><time>{new Date(result.created_at).toLocaleDateString()}</time></Link></TableCell>
              <TableCell className="text-left p-0"><Link href={`/invoices/${result.id}`} className="block font-semibold p-4">Phillip J. Fry</Link></TableCell>
              <TableCell className="text-left p-0"><Link href={`/invoices/${result.id}`} className="block p-4">fry@example.com</Link></TableCell>
              <TableCell className="text-center p-0"><Link href={`/invoices/${result.id}`} className="block p-4">
                <Badge className={cn(
                  "capitalize rounded-full",
                  result.status === 'open' && 'bg-blue-500',
                  result.status === 'paid' && 'bg-green-600',
                  result.status === 'void' && 'bg-zinc-700',
                  result.status === 'overdue' && 'bg-red-600',
                )}>{result.status}</Badge>
              </Link></TableCell>
              <TableCell className="text-right p-0"><Link href={`/invoices/${result.id}`} className="block font-semibold p-4">${(result.amount / 100).toFixed(2)}</Link></TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>

    </main >
  );
}
