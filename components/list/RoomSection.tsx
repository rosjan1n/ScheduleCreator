"use client";

import { ExtendedRoom } from "@/types/db";
import { Calendar, Search, Settings2, Users2 } from "lucide-react";
import { FC, useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import SelectBookmark from "../dashboard/SelectBookmark";

interface RoomSectionProps {
  rooms: ExtendedRoom[];
  tab: string;
}

const RoomSection: FC<RoomSectionProps> = ({ rooms, tab }) => {
  const [wantedRoom, setWantedRoom] = useState<string>("");

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(wantedRoom.toLowerCase())
  );
  return (
    <>
      <div className="gap-2 flex md:space-y-0 md:gap-0 md:justify-between mb-2">
        <SelectBookmark currentTab={tab} />
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          <Input
            className="w-fit"
            type="search"
            placeholder="Wyszukaj salę"
            value={wantedRoom}
            onChange={(e) => setWantedRoom(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded bg-muted p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
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
            <span className="text-muted-foreground">
              Nie znaleziono szukanej sali.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomSection;
