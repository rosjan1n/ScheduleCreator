import { db } from "@/lib/db";
import RoomSection from "./RoomSection";

async function RoomList() {
  const rooms = await db.room.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <RoomSection rooms={rooms} />;
}

export default RoomList;
