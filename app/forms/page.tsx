import CreateClass from "@/components/create/CreateClass";
import CreateLesson from "@/components/create/CreateLesson";
import CreateRoom from "@/components/create/CreateRoom";
import CreateSubject from "@/components/create/CreateSubject";
import CreateTeacher from "@/components/create/CreateTeacher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getAuthSession();

  const freeTeachers = await db.teacher.findMany({
    where: {
      assignedClass: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  const teachers = await db.teacher.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const rooms = await db.room.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const subjects = await db.subject.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const classes = await db.class.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const lessons = await db.lesson.findMany({});

  if (!session || !session.user) redirect("/");
  return (
    <div className="m-6">
      <header className="flex flex-col gap-10">
        <span id="page-title" className="font-semibold text-3xl">
          Formularze tworzenia
        </span>
        <div className="flex flex-col w-full">
          <Tabs defaultValue="classes">
            <TabsList>
              <TabsTrigger value="classes">Klasa</TabsTrigger>
              <TabsTrigger value="teachers">Nauczyciel</TabsTrigger>
              <TabsTrigger value="subjects">Przedmiot</TabsTrigger>
              <TabsTrigger value="rooms">Sala</TabsTrigger>
              <TabsTrigger value="lessons">Lekcje</TabsTrigger>
            </TabsList>
            <TabsContent value="classes">
              <CreateClass teachers={freeTeachers} />
            </TabsContent>
            <TabsContent value="teachers">
              <CreateTeacher />
            </TabsContent>
            <TabsContent value="subjects">
              <CreateSubject />
            </TabsContent>
            <TabsContent value="rooms">
              <CreateRoom />
            </TabsContent>
            <TabsContent value="lessons">
              <CreateLesson
                teachers={teachers}
                rooms={rooms}
                subjects={subjects}
                classes={classes}
                lessons={lessons}
              />
            </TabsContent>
          </Tabs>
        </div>
      </header>
    </div>
  );
};

export default page;
