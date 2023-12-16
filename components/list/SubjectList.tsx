import { db } from "@/lib/db";
import SubjectSection from "./SubjectSection";

async function SubjectList() {
  const subjects = await db.subject.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <SubjectSection subjects={subjects} />;
}

export default SubjectList;
