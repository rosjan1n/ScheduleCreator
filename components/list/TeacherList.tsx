import { db } from "@/lib/db";
import TeacherSection from "./TeacherSection";

async function TeacherList() {
  const teachers = await db.teacher.findMany({
    include: {
      assignedClass: true,
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <TeacherSection teachers={teachers} />;
}

export default TeacherList;
