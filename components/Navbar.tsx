"use client";
import { ModeToggle } from "@/components/themeMode";
import { PowerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { MdGroupAdd } from "react-icons/md";
import { SignOut } from "@/lib/actions";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const handleSignOutClick = async () => {
    try {
      await SignOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="w-full shadow-sm flex justify-between items-center px-2">
      <div>
        <Link href="/home/dashboard/">
          <Image src={Logo} alt="logo" width={165} height={75} priority />
        </Link>
      </div>

      <div>
        <ul className="flex flex-row items-center">
          <Link href="/home/create">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <MdGroupAdd className="cursor-pointer text-xl mx-2" />
            </li>
          </Link>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <ModeToggle />
          </li>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              await handleSignOutClick();
            }}
            className="cursor-pointer flex items-center"
          >
            <PowerIcon className="w-5 h-5" />
          </Button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
