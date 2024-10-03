import { sql } from 'drizzle-orm';
import { db } from "~/db";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Home() {
  const result = await db.execute(sql`SELECT current_database()`);
  console.log(result)
  return <>
    <main className="flex flex-col justify-center h-full text-center gap-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Invoice Buddy</h1>
      <p>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
    </main>
  </>;
}
