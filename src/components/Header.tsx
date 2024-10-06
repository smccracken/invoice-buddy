import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import Container from '~/components/Container';

const Header = () => {
  return (
    <header className='mt-2 mb-8'>
      <Container className='flex justify-between items-center py-2 border-b border-zinc-200'>
        <div className='flex items-center gap-4'>
          <Link
            href='/'
            className='flex items-center gap-2'
          >
            <Image
              src='/logo.png'
              alt='Invoice Buddy Logo'
              width={40}
              height={40}
            />
            <h1 className='font-bold text-2xl'>Invoice Buddy</h1>
          </Link>
          <span className='text-slate-300'>/</span>
          <SignedIn>
            <div className='-ml-2'>
              <OrganizationSwitcher afterCreateOrganizationUrl={'/invoices/'} />
            </div>
          </SignedIn>
        </div>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Container>
    </header>
  );
};

export default Header;
