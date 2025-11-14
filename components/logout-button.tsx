"use client";

import { LuLogOut } from "react-icons/lu";
import { Item } from "@radix-ui/react-dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleSignOut = async () =>
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });

  return (
    <div className="p-1">
      <Item
        asChild
        className="group flex w-full items-center rounded px-3 py-2 space-x-2 data-highlighted:bg-gray-100 data-highlighted:text-black outline-none text-gray-700 cursor-pointer"
      >
        <button
          onClick={handleSignOut}
          className="outline-none focus:outline-none focus-visible:outline-none flex items-center gap-2 w-full"
        >
          <LuLogOut className="size-4" />
          <span>Log out</span>
        </button>
      </Item>
    </div>
  );
}
