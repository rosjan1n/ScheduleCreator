import { getAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import EditClassForm from "@/components/edit/EditClassForm";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  const { id } = params;

  const foundedClass = await db.class.findFirst({
    where: {
      id,
    },
    include: {
      mainTeacher: true,
      lessons: true,
      groups: true,
    },
  });

  const freeTeachers = await db.teacher.findMany({
    where: {
      assignedClass: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!session || !session.user) redirect("/");
  if (!foundedClass) return notFound();

  return (
    <div className="m-6">
      <div className="flex flex-col gap-6">
        <span id="page-title" className="font-semibold text-3xl">
          Edytowanie klasy {foundedClass.name}
        </span>
        <EditClassForm editedClass={foundedClass} freeTeachers={freeTeachers} />
      </div>
    </div>
  );
};

export default page;
