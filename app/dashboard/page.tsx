import TeacherList from "@/components/list/TeacherList";
import ClassList from "@/components/list/ClassList";
import RoomList from "@/components/list/RoomList";
import SubjectList from "@/components/list/SubjectList";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";

type Param = string | string[] | undefined;

interface DashoardPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const DashboardPage = async ({ searchParams }: DashoardPageProps) => {
  const session = await getAuthSession();
  if (!session || !session.user) redirect("/");

  const tab = parse(searchParams.tab);

  if (!tab) redirect("/dashboard?tab=classes");

  function convertTabToTitle(tab: string) {
    switch (tab) {
      case "classes":
        return "klas";
      case "teachers":
        return "nauczycieli";
      case "subjects":
        return "przedmiotów";
      case "rooms":
        return "sal";
      default:
        return "";
    }
  }

  return (
    <div className="m-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-2 md:gap-0 md:flex-row md:items-center justify-between">
          <span id="page-title" className="font-semibold text-3xl">
            Panel
          </span>
          <div className="grid grid-cols-3 md:flex gap-2">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard?tab=classes"
            >
              Klasy
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard?tab=teachers"
            >
              Nauczyciele
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard?tab=subjects"
            >
              Przedmioty
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard?tab=rooms"
            >
              Sale
            </Link>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-xl">
            Lista {convertTabToTitle(tab)}
          </span>
          {tab === "classes" && <ClassList />}
          {tab === "teachers" && <TeacherList />}
          {tab === "subjects" && <SubjectList />}
          {tab === "rooms" && <RoomList />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
