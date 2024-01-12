import TeacherList from "@/components/list/TeacherList";
import ClassList from "@/components/list/ClassList";
import RoomList from "@/components/list/RoomList";
import SubjectList from "@/components/list/SubjectList";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LessonList from "@/components/list/LessonList";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

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
        <div className="flex flex-row items-center justify-between">
          <span id="page-title" className="font-semibold text-3xl">
            Panel
          </span>
          <Link
            href={`/forms?tab=${
              tab === "classes"
                ? "class"
                : tab === "teachers"
                ? "teacher"
                : tab === "rooms"
                ? "room"
                : tab === "subjects"
                ? "subject"
                : tab === "lessons"
                ? "lesson"
                : null
            }`}
            className={buttonVariants({ variant: "default" })}
          >
            <PlusCircleIcon className="mr-2 w-5 h-5" /> Stwórz{" "}
            {tab === "classes"
              ? "klasę"
              : tab === "teachers"
              ? "nauczyciela"
              : tab === "rooms"
              ? "salę"
              : tab === "subjects"
              ? "przedmiot"
              : tab === "lessons"
              ? "lekcję"
              : null}
          </Link>
        </div>
        <hr />
        {tab === "classes" && (
          <Suspense fallback={<Loader />}>
            <ClassList tab={tab} />
          </Suspense>
        )}
        {tab === "teachers" && (
          <Suspense fallback={<Loader />}>
            <TeacherList tab={tab} />
          </Suspense>
        )}
        {tab === "rooms" && (
          <Suspense fallback={<Loader />}>
            <RoomList tab={tab} />
          </Suspense>
        )}
        {tab === "subjects" && (
          <Suspense fallback={<Loader />}>
            <SubjectList tab={tab} />
          </Suspense>
        )}
        {tab === "lessons" && (
          <Suspense fallback={<Loader />}>
            <LessonList tab={tab} lessons={lessons} classes={classes} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
