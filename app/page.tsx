import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full text-center justify-center items-center gap-8">
      <div>
        <Link href="/home/dashboard/">
          <Image
            src={"/Logo.png"}
            alt="logo"
            width={900}
            height={318}
            className="w-full h-auto block dark:hidden mt-4"
            priority
          />
          <Image
            src={"/Logo-black.png"}
            alt="logo"
            width={300}
            height={106}
            className="w-full h-auto hidden dark:block mt-4"
            priority
          />
        </Link>
      </div>
      <h1 className="text-2xl">
        Welcome to <span className="text-primary">Splitease</span> for all your
        splitting needs.
      </h1>
      <div className="flex flex-row gap-2">
        <Link href="/sign" passHref>
          <Button variant={"outline"}>Sign Up</Button>
        </Link>
        <Link href="/login" passHref>
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  );
}
