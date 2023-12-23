import { db } from "@/lib/db";
import TeacherSection from "./TeacherSection";

interface Props {
  tab: string;
}

async function TeacherList({ tab }: Props) {
  const teachers = await db.teacher.findMany({
    include: {
      assignedClass: true,
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <TeacherSection tab={tab} teachers={teachers} />;
}

export default TeacherList;
