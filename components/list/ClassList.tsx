import { db } from "@/lib/db";
import ClassSection from "./ClassSection";
import { Suspense } from "react";
import Loader from "../Loader";

interface Props {
  tab: string;
}

const ClassList = async ({ tab }: Props) => {
  const classes = await db.class.findMany({
    include: {
      mainTeacher: true,
      lessons: true,
      groups: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <Suspense fallback={<Loader />}>
      <ClassSection tab={tab} classes={classes} />
    </Suspense>
  );
};

export default ClassList;
