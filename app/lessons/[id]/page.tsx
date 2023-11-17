import Schedule from "@/components/list/LessonList";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const { id } = params;

  const session = await getAuthSession();

  const group = await db.class.findFirst({
    where: {
      id,
    },
    include: {
      lessons: {
        include: {
          room: true,
          teacher: true,
          subject: true,
        },
      },
    },
  });

  if (!session || !session?.user) redirect("/");
  if (!group) notFound();

  return (
    <div className="container flex flex-col h-full max-w-full mx-auto">
      <div className="relative w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">Plan lekcji {group.name}</p>
          <div className="flex justify-end items-center">
            <Link
              href={`/edit/class/${group.id}/`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Edytuj klasę
            </Link>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="container mx-auto mt-4 mb-8">
        {/* <Schedule lessons={group.lessons} /> */}
      </div>
    </div>
  );
};

export default page;
