"use client";

import { FC, useState } from "react";
import { ExtendedLesson } from "@/types/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Class } from "@prisma/client";
import { cn, lessonList } from "@/lib/utils";
import moment from "moment";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Users } from "lucide-react";
import SelectBookmark from "../dashboard/SelectBookmark";

type Props = {
  lessons: ExtendedLesson[];
  classes: Class[];
  tab: string;
};

const LessonList: FC<Props> = ({ lessons, classes, tab }) => {
  const [selectedClass, setSelectedClass] = useState<string>("");

  const classLessons = lessons.filter(
    (lesson) => lesson.classId === selectedClass
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2 gap-2 md:flex md:space-y-0 md:gap-0 md:justify-between mb-2">
        <SelectBookmark currentTab={tab} />
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <Select
            defaultValue={selectedClass}
            onValueChange={(value) => setSelectedClass(value)}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Wybierz klasę" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((_class) => (
                <SelectItem key={_class.id} value={_class.id}>
                  {_class.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedClass !== "" ? (
        classLessons.length > 0 ? (
          <div className="grid grid-cols-1 2xl:grid-cols-5 gap-4 mt-6">
            {["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"].map(
              (day, index) => {
                const lessonsForDay = classLessons
                  .filter((lesson) => lesson.dayOfWeek === index + 1)
                  .sort((a, b) => a.lessonHour - b.lessonHour);

                return (
                  <div key={`${day}-${index}`} className="flex flex-col gap-2">
                    <span className="font-semibold text-lg text-center">
                      {day}
                    </span>
                    {lessonsForDay.length > 0 ? (
                      lessonsForDay.map((lesson, index) => (
                        <div
                          className="flex flex-col rounded-md p-2 bg-muted gap-2"
                          key={`${lesson.id}-${index}`}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {moment(
                                lessonList[lesson.lessonHour].startDate
                              ).format("HH:mm")}{" "}
                              -{" "}
                              {moment(
                                lessonList[lesson.lessonHour].endDate
                              ).format("HH:mm")}
                            </span>
                            <span className="font-semibold text-lg">
                              {lesson.subject.name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                              {lesson.teacher.name} {lesson.teacher.surname}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Sala {lesson.room.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Grupa - {lesson.group?.name || "Cała klasa"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="font-semibold text-lg text-center border-b border-muted 2xl:border-b-0">
                        Brak lekcji
                      </span>
                    )}
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mt-6">
            <span className="font-semibold text-lg text-center">
              Brak planu lekcji dla wybranej klasy
            </span>
            <Link
              href={"/forms?tab=lesson"}
              className={cn(buttonVariants({ variant: "secondary" }), "w-fit")}
            >
              Stwórz lekcję
            </Link>
          </div>
        )
      ) : (
        <span className="font-semibold text-lg text-center mt-6">
          Aby wyświetlić plan lekcji, wybierz klasę
        </span>
      )}
    </div>
  );
};

export default LessonList;
