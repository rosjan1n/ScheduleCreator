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
import { lessonList } from "@/lib/utils";
import moment from "moment";

type Props = {
  lessons: ExtendedLesson[];
  classes: Class[];
};

const LessonList: FC<Props> = ({ lessons, classes }) => {
  const [selectedClass, setSelectedClass] = useState<string>("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xl">Lista lekcji</span>
        <div className="flex justify-end">
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
      <div className="grid grid-cols-1 2xl:grid-cols-5 gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg text-center">
            Poniedziałek
          </span>
          {lessons
            .filter(
              (lesson) =>
                lesson.dayOfWeek === 1 && lesson.classId === selectedClass
            )
            .sort((a, b) => a.lessonHour - b.lessonHour)
            .map((lesson) => (
              <div
                className="flex flex-col rounded-md p-2 bg-muted gap-2"
                key={lesson.id}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {moment(lessonList[lesson.lessonHour].startDate).format(
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {moment(lessonList[lesson.lessonHour].endDate).format(
                      "HH:mm"
                    )}
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
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg text-center">Wtorek</span>
          {lessons
            .filter(
              (lesson) =>
                lesson.dayOfWeek === 2 && lesson.classId === selectedClass
            )
            .sort((a, b) => a.lessonHour - b.lessonHour)
            .map((lesson) => (
              <div
                className="flex flex-col rounded-md p-2 bg-muted gap-2"
                key={lesson.id}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {moment(lessonList[lesson.lessonHour].startDate).format(
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {moment(lessonList[lesson.lessonHour].endDate).format(
                      "HH:mm"
                    )}
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
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg text-center">Środa</span>
          {lessons
            .filter(
              (lesson) =>
                lesson.dayOfWeek === 3 && lesson.classId === selectedClass
            )
            .sort((a, b) => a.lessonHour - b.lessonHour)
            .map((lesson) => (
              <div
                className="flex flex-col rounded-md p-2 bg-muted gap-2"
                key={lesson.id}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {moment(lessonList[lesson.lessonHour].startDate).format(
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {moment(lessonList[lesson.lessonHour].endDate).format(
                      "HH:mm"
                    )}
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
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg text-center">Czwartek</span>
          {lessons
            .filter(
              (lesson) =>
                lesson.dayOfWeek === 4 && lesson.classId === selectedClass
            )
            .sort((a, b) => a.lessonHour - b.lessonHour)
            .map((lesson) => (
              <div
                className="flex flex-col rounded-md p-2 bg-muted gap-2"
                key={lesson.id}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {moment(lessonList[lesson.lessonHour].startDate).format(
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {moment(lessonList[lesson.lessonHour].endDate).format(
                      "HH:mm"
                    )}
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
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg text-center">Piątek</span>
          {lessons
            .filter(
              (lesson) =>
                lesson.dayOfWeek === 5 && lesson.classId === selectedClass
            )
            .sort((a, b) => a.lessonHour - b.lessonHour)
            .map((lesson) => (
              <div
                className="flex flex-col rounded-md p-2 bg-muted gap-2"
                key={lesson.id}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {moment(lessonList[lesson.lessonHour].startDate).format(
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {moment(lessonList[lesson.lessonHour].endDate).format(
                      "HH:mm"
                    )}
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default LessonList;
