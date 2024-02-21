"use client";

import { ExtendedClass } from "@/types/db";
import { FC, useState } from "react";
import { Calendar, Search, Settings2, Users2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";
import SelectBookmark from "../dashboard/SelectBookmark";

interface ClassSectionProps {
  classes: ExtendedClass[];
  tab: string;
}

const ClassSection: FC<ClassSectionProps> = ({ classes, tab }) => {
  const [wantedClass, setWantedClass] = useState<string>("");
  if (classes.length === 0)
    return (
      <div className="rounded bg-muted p-4 w-full">
        <span className="text-muted-foreground">
          Nie znaleziono w bazie klas.
        </span>
      </div>
    );

  const filteredClasses =
    wantedClass !== ""
      ? classes.filter((schoolClass) =>
          schoolClass.name.toLowerCase().includes(wantedClass.toLowerCase())
        )
      : classes;

  return (
    <>
      <div className="gap-2 flex md:space-y-0 md:gap-0 md:justify-between mb-2">
        <SelectBookmark currentTab={tab} />
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          <Input
            className="w-fit"
            type="search"
            placeholder="Wyszukaj klasę"
            value={wantedClass}
            onChange={(e) => setWantedClass(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded bg-muted p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((schoolClass) => (
              <div
                key={schoolClass.id}
                className="flex flex-col justify-between bg-white dark:bg-background shadow-sm rounded p-4"
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
                      <span className="text-sm text-zinc-500">
                        Grupa {i + 1}
                      </span>
                      <span className="text-sm truncate">
                        {schoolClass.groups[i]
                          ? `${schoolClass.groups[i].amountOfStudents} osób`
                          : "Brak"}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  id="footer"
                  className="flex items-center justify-between mt-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-zinc-500">Wychowawca</span>
                    <span className="text-sm truncate">
                      {schoolClass.mainTeacher.name}{" "}
                      {schoolClass.mainTeacher.surname}
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
            <span className="text-muted-foreground">
              Nie znaleziono szukanej klasy.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassSection;
