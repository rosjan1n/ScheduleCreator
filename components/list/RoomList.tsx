import { db } from "@/lib/db";
import { Calendar, Loader2, Settings2, Users2 } from "lucide-react";
import { Suspense } from "react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Loader from "../Loader";

async function RoomSection() {
  const rooms = await db.room.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return rooms.length > 0 ? (
    rooms.map((room) => (
      <div
        key={room.id}
        className="flex flex-col justify-between bg-white dark:bg-background shadow-sm rounded p-4 transition ease-out duration-300 hover:scale-105"
      >
        <div id="header" className="flex items-center justify-between">
          <span id="class-name" className="font-semibold text-lg">
            {room.name}
          </span>
          <Link
            className={cn(buttonVariants({ variant: "ghost" }))}
            href={`/edit/room/${room.id}/`}
          >
            <Settings2 className="w-5 h-5 text-indigo-600" />
          </Link>
        </div>
        <div id="footer" className="flex items-center mt-3">
          <div className="flex gap-3">
            <span className="flex items-center text-zinc-400">
              <Users2 className="w-4 h-4 mr-2 items-center text-zinc-400" />{" "}
              {room.capacity}
            </span>
            <span className="flex items-center text-zinc-400">
              <Calendar className="w-4 h-4 mr-2 items-center text-zinc-400" />{" "}
              {room.lessons.length}h
            </span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <span>Nie znaleziono sal lekcyjnych w bazie danych.</span>
  );
}

const RoomList = () => {
  return (
    <div className="rounded bg-muted p-4">
      <Suspense fallback={<Loader />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5">
          <RoomSection />
        </div>
      </Suspense>
    </div>
  );
};

export default RoomList;
