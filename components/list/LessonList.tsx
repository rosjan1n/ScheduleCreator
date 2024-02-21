import { db } from "@/lib/db";
import LessonSection from "./LessonSection";

interface Props {
  tab: string;
}

async function LessonList({ tab }: Props) {
  const lessons = await db.lesson.findMany({
    include: {
      room: true,
      subject: true,
      teacher: true,
      class: true,
      group: true,
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

  return (
    <LessonSection
      tab={tab}
      lessons={lessons}
      allClasses={classes}
      allGroups={groups}
      allRooms={rooms}
      allSubjects={subjects}
      allTeachers={teachers}
    />
  );
}

export default LessonList;
