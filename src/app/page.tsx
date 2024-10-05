import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import Link from 'next/link';
import Container from '~/components/Container';
import { Button } from '~/components/ui/button';

export default async function Home() {
  return (
    <>
      <main>
        <Container className='flex flex-col justify-center h-full text-center gap-6'>
          <h1 className='text-5xl font-bold'>Get That Bag 💰</h1>
          <p className='flex gap-2 justify-center'>
            <SignedIn>
              <Button asChild>
                <Link href='/invoices'>View Invoices</Link>
              </Button>
              <Button asChild>
                <Link href='/invoices/new'>Create New Invoice</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </p>
        </Container>
      </main>
    </>
  );
}
