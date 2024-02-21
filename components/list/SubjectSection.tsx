"use client";

import Link from "next/link";
import { FC, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Search, Settings2 } from "lucide-react";
import { ExtentedSubject } from "@/types/db";
import { Input } from "../ui/input";
import SelectBookmark from "../dashboard/SelectBookmark";

interface SubjectSectionProps {
  subjects: ExtentedSubject[];
  tab: string;
}

const SubjectSection: FC<SubjectSectionProps> = ({ subjects, tab }) => {
  const [wantedSubject, setWantedSubject] = useState<string>("");

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(wantedSubject.toLowerCase())
  );

  return (
    <>
      <div className="space-y-2 gap-2 md:flex md:space-y-0 md:gap-0 md:justify-between mb-2">
        <SelectBookmark currentTab={tab} />
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          <Input
            className="w-fit"
            type="search"
            placeholder="Wyszukaj przedmiot"
            value={wantedSubject}
            onChange={(e) => setWantedSubject(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded bg-muted p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className="flex flex-col justify-between bg-white dark:bg-background shadow-sm rounded p-4"
              >
                <div id="header" className="flex items-center justify-between">
                  <span id="class-name" className="font-semibold text-lg">
                    {subject.name}
                  </span>
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={`/edit/subject/${subject.id}/`}
                  >
                    <Settings2 className="w-5 h-5 text-indigo-600" />
                  </Link>
                </div>
                <div id="footer" className="flex items-center mt-3">
                  <span className="flex items-center text-zinc-400">
                    <Calendar className="w-4 h-4 mr-2 items-center text-zinc-400" />{" "}
                    {subject.lessons.length}h
                  </span>
                </div>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground">
              Nie znaleziono szukanego przedmiotu.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default SubjectSection;
