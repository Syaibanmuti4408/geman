import Link from "next/link";
import { Logo } from "@/components/logo";
import Account from "@/components/account";
import { NavLinks } from "@/components/nav-links"; // Import the new component

export default async function Header() {
  return (
    <header className="flex max-w-6xl container mx-auto select-none md:relative fixed inset-x-0 bottom-0 z-50 md:bg-transparent bg-white px-4 min-h-16">
      <div className="flex justify-between w-full border py-2 border-x-0 border-t-0 border-b-slate-200">
        <Link href={"/"} className="flex space-x-1 items-center justify-center">
          <Logo className="md:flex hidden" />
          <span className="text-2xl font-extrabold tracking-tight self-center pr-8 md:flex hidden">
            Geman
          </span>
        </Link>
        <nav className="flex w-full md:w-auto md:justify-start items-center">
          <NavLinks /> {/* Use the new component here */}
          <Account />
        </nav>
      </div>
    </header>
  );
}
