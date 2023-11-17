import { getAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import EditSubjectForm from "@/components/edit/EditSubjectForm";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  const { id } = params;

  const subject = await db.subject.findFirst({
    where: {
      id,
    },
  });

  if (!session || !session.user) redirect("/");
  if (!subject) return notFound();

  return (
    <div className="m-6">
      <header className="flex flex-col gap-10">
        <span id="page-title" className="font-semibold text-3xl">
          Edytowanie przedmiotu {subject.name}
        </span>
        <EditSubjectForm subject={subject} />
      </header>
    </div>
  );
};

export default page;
