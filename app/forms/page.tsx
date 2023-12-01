import CreateClass from "@/components/create/CreateClass";
import CreateLesson from "@/components/create/CreateLesson";
import CreateRoom from "@/components/create/CreateRoom";
import CreateSubject from "@/components/create/CreateSubject";
import CreateTeacher from "@/components/create/CreateTeacher";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
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

  function convertTabToTitle(tab: string | undefined) {
    switch (tab) {
      case "class":
        return "klasy";
      case "teacher":
        return "nauczyciela";
      case "subject":
        return "przedmiotu";
      case "room":
        return "sali";
      case "lesson":
        return "lekcji";
      default:
        return "";
    }
  }

  if (!session || !session.user) redirect("/");
  return (
    <div className="m-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-2 md:gap-0 md:flex-row md:items-center justify-between">
          <span id="page-title" className="font-semibold text-3xl">
            Formularze tworzenia
          </span>
          <div className="grid grid-cols-3 md:flex gap-2">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/forms?tab=class"
            >
              Klasa
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/forms?tab=teacher"
            >
              Nauczyciel
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/forms?tab=subject"
            >
              Przedmiot
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/forms?tab=room"
            >
              Sala
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/forms?tab=lesson"
            >
              Lekcja
            </Link>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          {tab !== undefined ? (
            <span className="font-semibold text-xl">
              Tworzenie {convertTabToTitle(tab)}
            </span>
          ) : null}
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
