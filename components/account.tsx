import Link from "@/components/custom-link";
import { Root, Trigger, Content, Item } from "@radix-ui/react-dropdown-menu";
import { LuUser } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FileText, ExternalLink } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { getServerSession } from "@/lib/auth";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogoutButton from "./logout-button"; // Added

export default async function Account() {
  const hasSessionCookie = getSessionCookie(new Headers(await headers()));
  const session = hasSessionCookie ? await getServerSession() : null;

  const avatar = createAvatar(lorelei, {
    size: 128,
    seed: "Nolan",
  }).toDataUri();

  return (
    <Root>
      <Trigger asChild>
        <Avatar className="size-10 cursor-pointer rounded-full border">
          <AvatarImage
            src={session?.user?.image ?? avatar}
            alt="avatar"
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>
            {(session?.user?.email?.[0] ?? "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Trigger>

      <Content
        align="end"
        sideOffset={12}
        className="w-56 divide-y divide-slate-300 text-gray-600 bg-white z-30 border border-slate-300 rounded outline-none shadow-md"
      >
        <div className="px-4 py-3">
          <p>
            <strong className="text-black capitalize">
              {session?.user?.name}
            </strong>
          </p>
          <p className="text-sm">{session?.user?.email}</p>
        </div>

        <div className="p-1">
          <Item asChild>
            <Link
              href="/account"
              className="group flex w-full items-center rounded px-3 py-2 space-x-2 data-highlighted:bg-gray-100 data-highlighted:text-black outline-none"
            >
              <LuUser className="size-5" />
              <span>Account</span>
            </Link>
          </Item>
          <Item asChild>
            <Link
              href="/settings"
              className="group flex w-full items-center rounded px-3 py-2 space-x-2 data-highlighted:bg-gray-100 data-highlighted:text-black outline-none"
            >
              <IoSettingsOutline className="size-5" />
              <span>Settings</span>
            </Link>
          </Item>
        </div>

        <div className="p-1">
          <Item asChild>
            <Link
              href="https://geman.shenlu.me"
              className="group flex w-full items-center justify-between rounded px-3 py-2 space-x-2 data-highlighted:bg-gray-100 data-highlighted:text-black outline-none"
            >
              <div className="flex items-center space-x-2">
                <FileText className="size-5" />
                <span>Documentation</span>
              </div>
              <ExternalLink className="size-5" />
            </Link>
          </Item>
        </div>
        <LogoutButton />
      </Content>
    </Root>
  );
}
