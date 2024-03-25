'use client';
import { ModeToggle } from '@/components/themeMode';
import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/Logo.png';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdGroupAdd } from 'react-icons/md';
import { SignOut } from '@/lib/actions';

const Navbar = () => {
  const handleSignOutClick = async () => {
    try {
      await SignOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className='w-full h-24 shadow-xl flex justify-between items-center px-2'>
      <div>
        <Link href='/home/dashboard/'>
          <Image src={Logo} alt='logo' width={165} height={75} priority />
        </Link>
      </div>

      <div>
        <ul className='flex flex-row items-center'>
          <Link href='/home/create/'>
            <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
              <MdGroupAdd className='cursor-pointer text-xl mx-2' />
            </li>
          </Link>
          <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
            <ModeToggle />
          </li>
          <li
            onClick={handleSignOutClick}
            className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center'
          >
            <PowerIcon className='w-5 h-5 mr-2' />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
