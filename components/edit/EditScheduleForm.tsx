"use client";

import { FC, startTransition, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { editLessonValidator } from "@/lib/validators/edit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BasicClass,
  BasicRoom,
  BasicSubject,
  BasicTeacher,
  ExtendedLesson,
} from "@/types/db";
import { Button } from "../ui/button";
import { cn, getNameOfDay, getRowStartClass, lessonList } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";
import { LessonDeletePayload } from "@/lib/validators/delete";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import moment from "moment";

interface EditScheduleFormProps {
  group: BasicClass;
  teachers: BasicTeacher[];
  subjects: BasicSubject[];
  rooms: BasicRoom[];
  lessons: ExtendedLesson[];
}

type formData = z.infer<typeof editLessonValidator> & {
  cohort: BasicClass;
};

const EditScheduleForm: FC<EditScheduleFormProps> = ({
  group,
  teachers,
  rooms,
  subjects,
  lessons,
}) => {
  const router = useRouter();
  const form = useForm<formData>({
    resolver: zodResolver(editLessonValidator),
  });

  // mutation for delete lesson
  const { mutate: deleteLesson, isLoading: deleteLoading } = useMutation({
    mutationFn: async ({ lessonId }: LessonDeletePayload) => {
      const payload: LessonDeletePayload = {
        lessonId,
      };

      const { data } = await axios.post(`/api/lesson/delete`, payload);

      return data;
    },
    onError: () => {
      return toast({
        title: "Coś poszło nie tak.",
        description: "Lekcja nie została usunięta. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Lekcja została usunięta.",
      });
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
    },
  });

  // mutation for create lesson
  const { mutate: createLesson, isLoading: createLoading } = useMutation({
    mutationFn: async ({
      dayOfWeek,
      lessonHour,
      group,
      cohort,
      room,
      teacher,
      subject,
    }: formData) => {
      const payload: formData = {
        dayOfWeek,
        lessonHour,
        group,
        cohort,
        room,
        teacher,
        subject,
      };

      const { data } = await axios.post(`/api/lesson`, payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.teacher) {
          return form.setError("teacher", {
            message: "Ten nauczyciel ma już przypisaną lekcję o tej godzinie.",
          });
        } else if (err.response?.data.room) {
          return form.setError("room", {
            message: "Ten pokój ma za małą liczbe miejsc na tą klasę.",
          });
        } else if (err.response?.data.busyGroup) {
          return form.setError("lessonHour", {
            message: "Jedna z grup ma już przypisaną lekcję o tej godzinie.",
          });
        } else if (err.response?.data.busyRoom) {
          return form.setError("room", {
            message: `Pokój o tej godzinie jest zajęty przez klasę ${err.response.data.busyRoom.class.name}.`,
          });
        }
      }
      return toast({
        title: "Coś poszło nie tak.",
        description: "Lekcja nie została stworzona. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Lekcja została stworzona.",
      });
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
    },
  });

  const foundLesson = lessons.find((lesson) =>
    form.watch().group
      ? lesson.lessonHour === Number(form.watch().lessonHour) &&
        lesson.dayOfWeek === Number(form.watch().dayOfWeek) + 1 &&
        lesson.group === Number(form.watch().group)
      : lesson.lessonHour === Number(form.watch().lessonHour) &&
        lesson.dayOfWeek === Number(form.watch().dayOfWeek) + 1
  );

  function onSubmit(data: formData) {
    data.cohort = group;

    createLesson(data);
  }

  useEffect(() => {
    if (foundLesson) {
      form.setValue("room", foundLesson.roomId);
      form.setValue("teacher", foundLesson.teacherId);
      form.setValue("subject", foundLesson.subjectId);
    } else {
      form.resetField("room");
      form.resetField("teacher");
      form.resetField("subject");
    }
  }, [foundLesson, form]);

  const groups = [
    {
      label: "Grupa 1",
      value: "1",
    },
    {
      label: "Grupa 2",
      value: "2",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="createLessonForm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Plan lekcji {group.name}</h1>
          <div className="flex gap-4 items-center">
            {group.isGroup && (
              <>
                <span className="text-xl font-semibold">Grupa</span>
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? groups.find(
                                    (group) => group.value === field.value
                                  )?.label
                                : "Wybierz grupę"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandGroup>
                              {groups.map((group) => (
                                <CommandItem
                                  value={group.label}
                                  key={group.value}
                                  onSelect={() => {
                                    if (group.value === field.value) {
                                      form.resetField("group");
                                    } else {
                                      form.setValue("group", group.value);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      group.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {group.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex my-7 gap-8">
          <div className="grid grid-cols-1 grid-rows-15 pr-4 border-r w-1/2">
            {Array.from({ length: 15 }, (_, row) => {
              const filteredLessons = lessons.filter((item: Lesson) =>
                form.watch().group
                  ? item.lessonHour === row &&
                    item.dayOfWeek === Number(form.watch().dayOfWeek) + 1 &&
                    item.group === Number(form.watch().group)
                  : item.lessonHour === row &&
                    item.dayOfWeek === Number(form.watch().dayOfWeek) + 1
              );

              return (
                <div
                  key={`${row}`}
                  className={cn(
                    getRowStartClass(row),
                    "border-t gap-y-4",
                    !form.watch().group && "grid grid-rows-2"
                  )}
                >
                  {filteredLessons.map((lesson, index) => (
                    <div
                      key={`${index}-${row}`}
                      className="border rounded m-3 bg-slate-100 dark:bg-zinc-900"
                    >
                      <div className="flex flex-col p-4">
                        <span id="lesson-hour">
                          Lekcja {lesson.lessonHour} -{" "}
                          {moment(
                            lessonList[lesson.lessonHour].startDate
                          ).format("H:mm")}{" "}
                          -{" "}
                          {moment(lessonList[lesson.lessonHour].endDate).format(
                            "H:mm"
                          )}
                        </span>
                        <hr className="block my-2" />
                        <span
                          id="subject-name"
                          className="truncate font-semibold mb-1"
                        >
                          {lesson.subject.name}
                        </span>
                        <span id="teacher" className="truncate text-sm">
                          {lesson.teacher.name} {lesson.teacher.surname}
                        </span>
                        <span id="room" className="truncate text-sm">
                          Sala {lesson.room.name}
                        </span>
                        {lesson.group && (
                          <span id="group" className="text-sm">
                            Grupa {lesson.group}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="w-full h-fit flex flex-col gap-4 sticky top-16">
            {group.isGroup && (
              <div className="border border-inherit rounded bg-red-400 dark:bg-red-950 p-4 flex gap-2 items-center">
                <Info className="w-4 h-4" />
                <span>
                  Jeżeli nie wybierzesz grupy, lekcja zostanie przypisana dla
                  całej klasy.
                </span>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
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
                        {Array.from({ length: 5 }, (_, k) => (
                          <SelectItem key={k} value={`${k}`}>
                            {getNameOfDay(k)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lessonHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Godzina lekcyjna</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz godzine lekcyjną" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, k) => (
                          <SelectItem key={k} value={`${k}`}>
                            {`${k} lekcja`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch().dayOfWeek && form.watch().lessonHour ? (
                <>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Przedmiot</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz przedmiot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject, index) => (
                              <SelectItem key={index} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teacher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nauczyciel</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz nauczyciela" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher, index) => (
                              <SelectItem key={index} value={teacher.id}>
                                {teacher.name} {teacher.surname}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Klasa</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz klasę" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rooms.map((room, index) => (
                              <SelectItem key={index} value={room.id}>
                                {room.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : null}
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                form="createLessonForm"
                isLoading={createLoading}
                disabled={!form.watch().dayOfWeek || !form.watch().lessonHour}
              >
                Stwórz lekcję
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => deleteLesson({ lessonId: foundLesson?.id! })}
                isLoading={deleteLoading}
                disabled={!foundLesson || deleteLoading}
              >
                Usuń lekcję
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EditScheduleForm;
