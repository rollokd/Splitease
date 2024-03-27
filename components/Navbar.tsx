'use client';
import { ModeToggle } from '@/components/themeMode';
import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { MdGroupAdd } from 'react-icons/md';
import { SignOut } from '@/lib/actions';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { usePathname  } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter();
  const handleSignOutClick = async () => {
    try {
      await SignOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  let display = true;
  if (pathname === '/login' || pathname === '/sign') {
    display = false;
  }

 
  

  return (
    <nav className='w-full shadow-sm flex justify-between items-center px-2'>
      <div>
        <Link href='/home/dashboard/'>
          <Image
            src={'/Logo.png'}
            alt='logo'
            width={150}
           height={53}
           className="block dark:hidden mt-4"
            priority
          />
                  <Image
            src={'/Logo-black.png'}
            alt='logo'
           width={150}
           height={53}
           className="hidden dark:block mt-4"
            priority
          />
        </Link>
      </div>

      <div>
        <ul className='flex flex-row items-center mt-4'>
        {display  && (
          <Link href='/home/create'>
            <li className='px-4 py-2 cursor-pointer'>
              <MdGroupAdd className='cursor-pointer text-xl mx-2' />
            </li>
          </Link>
        )}
          <li className='px-4 py-2 cursor-pointer'>
            <ModeToggle />
          </li>
          {display && (
            <Button
              onClick={async (e) => {
                e.preventDefault();
                await handleSignOutClick();
              }}
              className='cursor-pointer flex items-center'
              aria-label="Logout"
            >
              <PowerIcon className='w-5 h-5' />
            </Button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
