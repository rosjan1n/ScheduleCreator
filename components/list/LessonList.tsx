import { FC } from "react";
import { Room, Subject, Teacher } from "@prisma/client";

type Props = {
  dayOfWeek: number;
  lessonHour: number;
  teacher: Teacher;
  subject: Subject;
  room: Room;
};

const LessonList: FC<Props> = ({
  dayOfWeek,
  lessonHour,
  teacher,
  subject,
  room,
}) => {
  return (
    <div className="relative border rounded w-auto py-2 px-4">
      <div className="absolute -left-4 inset-y-0 flex items-center">
        <span>{lessonHour}.</span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-lg">{subject.name}</span>
        <span>Sala {room.name}</span>
        <span className="text-sm">
          {teacher.name} {teacher.surname}
        </span>
      </div>
    </div>
  );
};

export default LessonList;
