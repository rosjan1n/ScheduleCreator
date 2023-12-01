import TeacherList from "@/components/list/TeacherList";
import ClassList from "@/components/list/ClassList";
import RoomList from "@/components/list/RoomList";
import SubjectList from "@/components/list/SubjectList";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";
import LessonList from "@/components/list/LessonList";

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

  const classes = await db.class.findMany();

  const lessons = await db.lesson.findMany({
    include: {
      teacher: true,
      subject: true,
      room: true,
      class: true,
      group: true,
    },
  });

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
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard?tab=lessons"
            >
              Lekcje
            </Link>
          </div>
        </div>
        <hr />
        {tab === "classes" && <ClassList />}
        {tab === "teachers" && <TeacherList />}
        {tab === "subjects" && <SubjectList />}
        {tab === "rooms" && <RoomList />}
        {tab === "lessons" && (
          <LessonList lessons={lessons} classes={classes} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
