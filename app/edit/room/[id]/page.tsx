import { getAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import EditRoomForm from "@/components/edit/EditRoomForm";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  const { id } = params;

  const room = await db.room.findFirst({
    where: {
      id,
    },
  });

  if (!session || !session.user) redirect("/");
  if (!room) return notFound();

  return (
    <div className="m-6">
      <header className="flex flex-col gap-10">
        <span id="page-title" className="font-semibold text-3xl">
          Edytowanie sali {room.name}
        </span>
        <EditRoomForm room={room} />
      </header>
    </div>
  );
};

export default page;
