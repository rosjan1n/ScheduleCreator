"use client";

import { Button } from "@/components/ui/button";
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
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  createLessonValidator,
  createScheduleValidator,
} from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Class, Lesson, Room, Subject, Teacher } from "@prisma/client";
import { FC } from "react";
import { cn, groups, lessonList } from "@/lib/utils";
import moment from "moment";
import { Check, ChevronsUpDown } from "lucide-react";
import LessonList from "../list/LessonList";
import { useMutation } from "@tanstack/react-query";

interface Props {
  teachers: Teacher[];
  rooms: Room[];
  subjects: Subject[];
  classes: Class[];
  lessons: Lesson[];
}

type addFormData = z.infer<typeof createLessonValidator>;
type AddScheduleFormData = z.infer<typeof createScheduleValidator>;

const CreateLesson: FC<Props> = ({
  teachers,
  rooms,
  subjects,
  classes,
  lessons,
}) => {
  const router = useRouter();
  const addForm = useForm<addFormData>({
    resolver: zodResolver(createLessonValidator),
  });
  const createForm = useForm<AddScheduleFormData>({
    resolver: zodResolver(createScheduleValidator),
  });

  const {
    fields: tLessons,
    append,
    remove,
  } = useFieldArray({ control: createForm.control, name: "lesson" });

  const { mutate: addLesson, isLoading } = useMutation({
    mutationFn: async ({
      dayOfWeek,
      lessonHour,
      roomId,
      subjectId,
      classId,
      teacherId,
      group,
    }: addFormData) => {
      try {
        const busyRoom = lessons.find(
          (lesson) =>
            lesson.dayOfWeek === Number(dayOfWeek) &&
            lesson.lessonHour === Number(lessonHour) &&
            lesson.roomId === roomId
        );

        if (busyRoom)
          return new Response(JSON.stringify({ busyRoom: true }), {
            status: 409,
          });
      } catch (error) {}
    },
  });

  function onSubmit(data: addFormData) {
    append(data);
  }

  return (
    <div className="flex flex-col rounded bg-muted p-4">
      <Form {...addForm}>
        <form
          onSubmit={addForm.handleSubmit((data) => onSubmit(data))}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <FormField
              control={addForm.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klasa</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz klasę" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((group, i) => (
                        <SelectItem key={`${group.id}-${i}`} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Wybierz klasę.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {addForm.watch().classId && (
              <>
                <FormField
                  control={addForm.control}
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dzień tygodnia</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz dzień" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Poniedziałek",
                            "Wtorek",
                            "Środa",
                            "Czwartek",
                            "Piątek",
                          ].map((day, i) => (
                            <SelectItem key={`${day}-${i}`} value={`${++i}`}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Wybierz dzień tygodnia.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="lessonHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Godzina lekcyjna</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz godzine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 15 }, (_, i) => (
                            <SelectItem key={i} value={`${i}`}>
                              {i}.{" "}
                              {moment(lessonList[i].startDate).format("H:mm")}-
                              {moment(lessonList[i].endDate).format("H:mm")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Wybierz godzine lekcyjną.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {classes.find(
                  (group) =>
                    group.isGroup && group.id === addForm.watch().classId
                ) && (
                  <FormField
                    control={addForm.control}
                    name="group"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Grupa</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
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
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandGroup>
                                {groups.map((group) => (
                                  <CommandItem
                                    value={group.label}
                                    key={group.value}
                                    onSelect={() => {
                                      if (group.value === field.value) {
                                        addForm.resetField("group");
                                      } else {
                                        addForm.setValue("group", group.value);
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
                        <FormDescription>
                          Wybierz grupę. Jeżeli nie wybierzesz grupy, lekcja
                          zostanie przypisana dla całej klasy.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={addForm.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Przedmiot</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz przedmiot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject, i) => (
                            <SelectItem
                              key={`${subject.id}-${i}`}
                              value={subject.id}
                            >
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Wybierz przedmiot.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz salę" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms.map((room, i) => (
                            <SelectItem key={`${room.id}-${i}`} value={room.id}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Wybierz salę.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nauczyciel</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz nauczyciela" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher, i) => (
                            <SelectItem
                              key={`${teacher.id}-${i}`}
                              value={teacher.id}
                            >
                              {teacher.name} {teacher.surname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Wybierz nauczyciela.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Dodaj lekcję do listy</Button>
          </div>
        </form>
      </Form>
      <div className="grid grid-cols-1 gap-4 ml-5">
        {tLessons.map((lesson, index) => {
          const foundedTeacher = teachers.find(
            (teacher) => teacher.id === lesson.teacherId
          );
          const foundedSubject = subjects.find(
            (subject) => subject.id === lesson.subjectId
          );
          const foundedRoom = rooms.find((room) => room.id === lesson.roomId);

          return (
            <LessonList
              key={index}
              dayOfWeek={Number(lesson.dayOfWeek)}
              lessonHour={Number(lesson.lessonHour)}
              teacher={foundedTeacher!}
              subject={foundedSubject!}
              room={foundedRoom!}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CreateLesson;
