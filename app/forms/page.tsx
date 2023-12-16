import CreateClass from "@/components/create/CreateClass";
import CreateLesson from "@/components/create/CreateLesson";
import CreateRoom from "@/components/create/CreateRoom";
import CreateSubject from "@/components/create/CreateSubject";
import CreateTeacher from "@/components/create/CreateTeacher";
import SelectBookmark from "@/components/dashboard/SelectBookmark";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Param = string | string[] | undefined;

interface FormsPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const page = async ({ searchParams }: FormsPageProps) => {
  const session = await getAuthSession();

  if (!session || !session.user) redirect("/");

  const tab = parse(searchParams.tab);

  if (!tab) redirect("/forms?tab=class");

  const freeTeachers = await db.teacher.findMany({
    where: {
      assignedClass: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  const teachers = await db.teacher.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const rooms = await db.room.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const subjects = await db.subject.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const classes = await db.class.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const groups = await db.group.findMany();

  if (!session || !session.user) redirect("/");
  return (
    <div className="m-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-0 flex-row items-center justify-between mb-2">
          <span id="page-title" className="font-semibold text-3xl">
            Formularze tworzenia
          </span>
          <SelectBookmark currentTab={tab} isForms />
        </div>
        <div className="flex flex-col gap-2">
          {tab === "class" && <CreateClass teachers={freeTeachers} />}
          {tab === "teacher" && <CreateTeacher />}
          {tab === "subject" && <CreateSubject />}
          {tab === "room" && <CreateRoom />}
          {tab === "lesson" && (
            <CreateLesson
              allClasses={classes}
              allGroups={groups}
              allRooms={rooms}
              allSubjects={subjects}
              allTeachers={teachers}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
