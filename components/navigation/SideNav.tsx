import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import SideBar from "./SideBar";
import ToggleTheme from "../theme/ToggleTheme";

const SideNav = async () => {
  const session = await getAuthSession();

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-background border-b border-inherit">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-foreground dark:focus:ring-gray-600"
              >
                <span className="sr-only">Otwórz menu</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href={"/dashboard"} className="ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold md:text-2xl whitespace-nowrap bg-clip-text text-transparent from-purple-500 to-indigo-500 bg-gradient-to-r">
                  Kreator planu
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-4 ml-3">
                <ToggleTheme />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SideBar user={session?.user} />
    </>
  );
};

export default SideNav;
