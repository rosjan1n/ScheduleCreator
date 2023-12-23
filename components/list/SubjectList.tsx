import { db } from "@/lib/db";
import SubjectSection from "./SubjectSection";

interface Props {
  tab: string;
}

async function SubjectList({ tab }: Props) {
  const subjects = await db.subject.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <SubjectSection tab={tab} subjects={subjects} />;
}

export default SubjectList;
