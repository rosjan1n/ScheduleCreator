import { db } from "@/lib/db";
import RoomSection from "./RoomSection";

interface Props {
  tab: string;
}

async function RoomList({ tab }: Props) {
  const rooms = await db.room.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <RoomSection tab={tab} rooms={rooms} />;
}

export default RoomList;
