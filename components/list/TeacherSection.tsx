"use client";

import { Calendar, Search, Settings2 } from "lucide-react";
import { FC, useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { ExtendedTeacher } from "@/types/db";
import SelectBookmark from "../dashboard/SelectBookmark";

interface TeacherSectionProps {
  teachers: ExtendedTeacher[];
  tab: string;
}

const TeacherSection: FC<TeacherSectionProps> = ({ teachers, tab }) => {
  const [wantedTeacher, setWantedTeacher] = useState<string>("");

  if (teachers.length === 0)
    return (
      <div className="rounded bg-muted p-4 w-full">
        <span className="text-muted-foreground">
          Nie znaleziono w bazie nauczycieli.
        </span>
      </div>
    );

  const filteredTeachers =
    wantedTeacher !== ""
      ? teachers.filter(
          (teacher) =>
            teacher.name.toLowerCase().includes(wantedTeacher.toLowerCase()) ||
            teacher.surname.toLowerCase().includes(wantedTeacher.toLowerCase())
        )
      : teachers;

  return (
    <>
      <div className="space-y-2 gap-2 md:flex md:space-y-0 md:gap-0 md:justify-between mb-2">
        <SelectBookmark currentTab={tab} />
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          <Input
            className="w-fit"
            type="search"
            placeholder="Wyszukaj nauczyciela"
            value={wantedTeacher}
            onChange={(e) => setWantedTeacher(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded bg-muted p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
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
                      <span className="text-sm text-zinc-500">
                        Przypisana klasa
                      </span>
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
            <span className="text-muted-foreground">
              Nie znaleziono szukanego nauczyciela.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherSection;
