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


export default function Dashboard() {
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
            <TableHead className="text-left px-4 py-2">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-left font-medium p-4"><span className="font-semibold">10/1/2024</span></TableCell>
            <TableCell className="text-left p-4"><span className="font-semibold">Phillip J. Fry</span></TableCell>
            <TableCell className="text-left p-4"><span>fry@example.com</span></TableCell>
            <TableCell className="text-center p-4"><Badge className="rounded-full">Open</Badge></TableCell>
            <TableCell className="text-left p-4"><span className="font-semibold">$250.00</span></TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </main >
  );
}
