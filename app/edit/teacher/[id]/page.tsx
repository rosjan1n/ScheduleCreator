import { getAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import EditTeacherForm from "@/components/edit/EditTeacherForm";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  const { id } = params;

  const teacher = await db.teacher.findFirst({
    where: {
      id,
    },
  });

  if (!session || !session.user) redirect("/");
  if (!teacher) return notFound();

  return (
    <div className="m-6">
      <div className="flex flex-col gap-6">
        <span id="page-title" className="font-semibold text-3xl">
          Edytowanie nauczyciela {teacher.name} {teacher.surname}
        </span>
        <EditTeacherForm teacher={teacher} />
      </div>
    </div>
  );
};

export default page;
