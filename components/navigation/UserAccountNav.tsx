"use client";

import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserAvatar } from "../UserAvatar";
import { LogOut, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <div className="flex items-center justify-evenly w-full">
      <div className="flex items-center gap-2">
        <UserAvatar
          className="h-8 w-8 border-2 border-zinc-400"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
        <span className="text-sm">{user.name}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              signOut({
                callbackUrl: `${window.location.origin}/`,
              });
            }}
          >
            Wyloguj się
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserAccountNav;
