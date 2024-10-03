import Container from '~/components/Container';

const Footer = () => {
  return (
    <footer className='mt-12 mb-2'>
      <Container className='flex justify-between items-center py-4 border-t border-zinc-200'>
        <small>Invoice Buddy &copy; {new Date().getFullYear()}</small>
        <small>Made with ❤️ by Scott McCracken</small>
      </Container>
    </footer>
  );
};

export default Footer;
