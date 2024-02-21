"use client";

import { toast } from "sonner";
import { lessonValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class, Group, Room, Subject, Teacher } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

interface Props {
  allClasses: Class[];
  allRooms: Room[];
  allSubjects: Subject[];
  allTeachers: Teacher[];
  allGroups: Group[];
}

type formData = z.infer<typeof lessonValidator>;

const CreateLesson = ({
  allClasses,
  allRooms,
  allSubjects,
  allTeachers,
  allGroups,
}: Props) => {
  const router = useRouter();
  const form = useForm<formData>({
    resolver: zodResolver(lessonValidator),
    defaultValues: {
      groupId: "undefined",
    },
  });

  const { mutate: createLesson, isLoading } = useMutation({
    mutationFn: async ({
      classId,
      roomId,
      subjectId,
      teacherId,
      dayOfWeek,
      lessonHour,
      groupId,
    }: formData) => {
      const payload: formData = {
        classId,
        roomId,
        subjectId,
        teacherId,
        dayOfWeek,
        lessonHour,
        groupId,
      };

      const { data } = await axios.post("/api/lesson", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data?.error === "LessonAlreadyExists") {
          return form.setError("lessonHour", {
            message: "Lekcja o tej godzinie już istnieje.",
          });
        } else if (err.response?.data?.error === "ClassHaveLessonAtThisTime") {
          form.setError("lessonHour", {
            message: "Ta klasa ma już lekcję o tej godzinie.",
          });
          form.setError("classId", {
            message: "Ta klasa ma już lekcję o tej godzinie.",
          });
          return;
        } else if (
          err.response?.data?.error === "LessonWithTeacherAlreadyExists"
        ) {
          return form.setError("teacherId", {
            message: "Ten nauczyciel ma już lekcję o tej godzinie.",
          });
        } else if (err.response?.data?.error === "LessonInRoomAlreadyExists") {
          return form.setError("roomId", {
            message: "Ta sala ma już lekcję o tej godzinie.",
          });
        } else if (err.response?.data?.error === "RoomIsTooSmallForThisClass") {
          return form.setError("roomId", {
            message: "Ta sala jest za mała dla tej klasy.",
          });
        }
      }

      return toast.error("Coś poszło nie tak.", {
        description: "Lekcja nie została stworzona. Spróbuj ponownie później.",
      });
    },
    onSuccess: () => {
      toast.success("Lekcja została stworzona.");
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // re-rendering the whole page
        router.refresh();
      });
    },
  });

  return (
    <div className="rounded bg-muted p-4">
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit((data) => createLesson(data))}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klasa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz klasę" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allClasses.map((class_) => (
                        <SelectItem key={class_.id} value={class_.id}>
                          {class_.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wybierz klasę, dla której chcesz dodać lekcję.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nauczyciel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz nauczyciela" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} {teacher.surname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wybierz nauczyciela, który będzie prowadził lekcję.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sala</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz salę" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wybierz salę, w której odbędzie się lekcja.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Przedmiot</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz przedmiot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wybierz przedmiot, który będzie na lekcji.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dzień tygodnia</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz dzień tygodnia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "Poniedziałek",
                        "Wtorek",
                        "Środa",
                        "Czwartek",
                        "Piątek",
                      ].map((value, index) => (
                        <SelectItem key={index} value={`${index + 1}`}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wybierz dzień tygodnia, w którym odbędzie się lekcja.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lessonHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numer lekcji</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz numer lekcji" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => (
                        <SelectItem key={`lesson-${i}`} value={`${i}`}>
                          {i === 0 ? "0" : i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wybierz numer lekcji, w której odbędzie się lekcja.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {allGroups.find(
              (group) => group.classId === form.watch("classId")
            ) && (
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz grupę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="undefined">Cała klasa</SelectItem>
                        {allGroups
                          .filter(
                            (group) => group.classId === form.watch("classId")
                          )
                          .map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              Grupa {group.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Wybierz grupę, która będzie miała lekcję.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Stwórz lekcję
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateLesson;
