"use client";

import { CalendarPlus, Tv2 } from "lucide-react";
import Link from "next/link";
import "flowbite";
import UserAccountNav from "./UserAccountNav";
import { User } from "next-auth";
import { buttonVariants } from "../ui/button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image"> | undefined;
}

const SideBar = ({ user }: Props) => {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-background border-r border-inherit md:translate-x-0"
      aria-label="Sidebar"
      aria-hidden="true"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <div className="flex flex-col justify-between h-full font-medium">
          <div className="flex flex-col gap-2">
            <Link
              href={"/dashboard?tab=classes"}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-muted/50 group"
            >
              <Tv2 className="w-5 h-5" />
              <span className="ml-3">Panel</span>
            </Link>
            <Link
              href={"/forms?tab=class"}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-muted/50 group"
            >
              <CalendarPlus className="w-5 h-5" />
              <span className="ml-3">Formularze</span>
            </Link>
          </div>
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link href={"/"} className={buttonVariants()}>
              Zaloguj się
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
