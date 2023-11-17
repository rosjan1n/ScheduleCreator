"use client";

import { CalendarPlus, LogOut, Tv2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import "flowbite";

interface Props {
  isLogged: boolean;
}

const SideBar = ({ isLogged }: Props) => {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-background border-r border-inherit md:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              href={"/dashboard"}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-muted/50 group"
            >
              <Tv2 className="w-5 h-5" />
              <span className="ml-3">Panel</span>
            </Link>
          </li>
          <li>
            <Link
              href={"/forms"}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-muted/50 group"
            >
              <CalendarPlus className="w-5 h-5" />
              <span className="ml-3">Formularze</span>
            </Link>
          </li>
          {isLogged && (
            <li>
              <div
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-muted/50 hover:cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({
                    callbackUrl: `${window.location.origin}/`,
                  });
                }}
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Wyloguj się</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
