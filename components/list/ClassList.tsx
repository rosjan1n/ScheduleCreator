import { db } from "@/lib/db";
import { Calendar, Settings2, Users2 } from "lucide-react";
import { Suspense } from "react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Loader from "../Loader";

async function ClassSection() {
  const classes = await db.class.findMany({
    include: {
      mainTeacher: true,
      lessons: true,
      groups: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return classes.length > 0 ? (
    classes.map((schoolClass) => (
      <div
        key={schoolClass.id}
        className="flex flex-col justify-between bg-white dark:bg-background shadow-sm rounded p-4 transition ease-out duration-300 hover:scale-105"
      >
        <div id="header" className="flex items-center justify-between">
          <span id="class-name" className="font-semibold text-lg">
            {schoolClass.name}
          </span>
          <div className="flex gap-1">
            <Link
              className={cn(buttonVariants({ variant: "ghost" }))}
              href={`/edit/class/${schoolClass.id}/`}
            >
              <Settings2 className="w-5 h-5 text-indigo-600" />
            </Link>
          </div>
        </div>
        <div id="content" className="flex flex-col gap-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-sm text-zinc-500">Grupa {i + 1}</span>
              <span className="text-sm truncate">
                {schoolClass.groups[i]
                  ? `${schoolClass.groups[i].amountOfStudents} osób`
                  : "Brak"}
              </span>
            </div>
          ))}
        </div>
        <div id="footer" className="flex items-center justify-between mt-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-500">Wychowawca</span>
            <span className="text-sm truncate">
              {schoolClass.mainTeacher.name} {schoolClass.mainTeacher.surname}
            </span>
          </div>
          <div className="flex gap-3">
            <span className="flex items-center text-zinc-400">
              <Users2 className="w-4 h-4 mr-2 items-center text-zinc-400" />{" "}
              {schoolClass.amountOfStudents}
            </span>
            <span className="flex items-center text-zinc-400">
              <Calendar className="w-4 h-4 mr-2 items-center text-zinc-400" />{" "}
              {schoolClass.lessons.length}h
            </span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="w-full">
      <span className="text-center">Nie znaleziono w bazie klas.</span>
    </div>
  );
}

const ClassList = () => {
  return (
    <div className="rounded bg-muted p-4">
      <Suspense fallback={<Loader />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5">
          <ClassSection />
        </div>
      </Suspense>
    </div>
  );
};

export default ClassList;
