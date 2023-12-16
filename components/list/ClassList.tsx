import { db } from "@/lib/db";
import ClassSection from "./ClassSection";
import { Suspense } from "react";
import Loader from "../Loader";

const ClassList = async () => {
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
      <ClassSection classes={classes} />
    </Suspense>
  );
};

export default ClassList;
