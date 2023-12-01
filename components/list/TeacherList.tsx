import { db } from "@/lib/db";
import { Calendar, Loader2, Settings2, Users2 } from "lucide-react";
import { Suspense } from "react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Loader from "../Loader";

async function TeacherSection() {
  const teachers = await db.teacher.findMany({
    include: {
      assignedClass: true,
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  /* TODO: Wyszukiwanie nauczyciela po imieniu, nazwisku lub klasie */
  return teachers.length > 0 ? (
    teachers.map((teacher) => (
      <div
        key={teacher.id}
        className="flex flex-col justify-between bg-white dark:bg-background shadow-sm rounded p-4 transition ease-out duration-300 hover:scale-105"
      >
        <div id="header" className="flex items-center justify-between">
          <span id="class-name" className="font-semibold text-lg">
            {teacher.name} {teacher.surname}
          </span>
          <Link
            className={cn(buttonVariants({ variant: "ghost" }))}
            href={`/edit/teacher/${teacher.id}/`}
          >
            <Settings2 className="w-5 h-5 text-indigo-600" />
          </Link>
        </div>
        <div id="content" className="flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500">Przypisana klasa</span>
              <span className="text-sm">
                {teacher.assignedClass
                  ? `${teacher.assignedClass.name}`
                  : "Brak"}
              </span>
            </div>
          </div>
        </div>
        <div id="footer" className="flex items-center mt-3">
          <span className="flex items-center text-zinc-400">
            <Calendar className="w-4 h-4 mr-2 items-center text-zinc-400" />{" "}
            {teacher.lessons.length}h
          </span>
        </div>
      </div>
    ))
  ) : (
    <span>Nie znaleziono nauczycieli w bazie danych.</span>
  );
}

const TeacherList = () => {
  return (
    <div className="rounded bg-muted p-4">
      <Suspense fallback={<Loader />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5">
          <TeacherSection />
        </div>
      </Suspense>
    </div>
  );
};

export default TeacherList;
