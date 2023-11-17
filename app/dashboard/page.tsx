import TeacherList from "@/components/list/TeacherList";
import ClassList from "@/components/list/ClassList";
import RoomList from "@/components/list/RoomList";
import SubjectList from "@/components/list/SubjectList";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = async () => {
  const session = await getAuthSession();

  if (!session || !session.user) redirect("/");

  return (
    <div className="m-6">
      <header className="flex flex-col gap-10">
        <span id="page-title" className="font-semibold text-3xl">
          Panel
        </span>
        <div className="flex flex-col w-full">
          <Tabs defaultValue="classes">
            <TabsList>
              <TabsTrigger value="classes">Klasy</TabsTrigger>
              <TabsTrigger value="teachers">Nauczyciele</TabsTrigger>
              <TabsTrigger value="subjects">Przedmioty</TabsTrigger>
              <TabsTrigger value="rooms">Sale</TabsTrigger>
            </TabsList>
            <TabsContent value="classes">
              <ClassList />
            </TabsContent>
            <TabsContent value="teachers">
              <TeacherList />
            </TabsContent>
            <TabsContent value="subjects">
              <SubjectList />
            </TabsContent>
            <TabsContent value="rooms">
              <RoomList />
            </TabsContent>
          </Tabs>
        </div>
      </header>
    </div>
  );
};

export default page;
