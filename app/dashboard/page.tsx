import TeacherList from "@/components/list/TeacherList";
import ClassList from "@/components/list/ClassList";
import RoomList from "@/components/list/RoomList";
import SubjectList from "@/components/list/SubjectList";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LessonList from "@/components/list/LessonList";
import SelectBookmark from "@/components/dashboard/SelectBookmark";
import { Suspense } from "react";
import Loader from "@/components/Loader";

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
        <div className="flex flex-row items-center justify-between mb-2">
          <span id="page-title" className="font-semibold text-3xl">
            Panel
          </span>
          <SelectBookmark currentTab={tab} />
        </div>
        {tab === "classes" && (
          <Suspense fallback={<Loader />}>
            <ClassList />
          </Suspense>
        )}
        {tab === "teachers" && (
          <Suspense fallback={<Loader />}>
            <TeacherList />
          </Suspense>
        )}
        {tab === "rooms" && (
          <Suspense fallback={<Loader />}>
            <RoomList />
          </Suspense>
        )}
        {tab === "subjects" && (
          <Suspense fallback={<Loader />}>
            <SubjectList />
          </Suspense>
        )}
        {tab === "lessons" && (
          <Suspense fallback={<Loader />}>
            <LessonList lessons={lessons} classes={classes} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
