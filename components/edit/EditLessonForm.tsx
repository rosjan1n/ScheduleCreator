"use client";

import { FC, startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Settings2 } from "lucide-react";
import { ExtendedLesson } from "@/types/db";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Class, Group, Room, Subject, Teacher } from "@prisma/client";
import { lessonList } from "@/lib/utils";
import moment from "moment";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { lessonValidator } from "@/lib/validators/basic";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface EditLessonFormProps {
  allClasses: Class[];
  allRooms: Room[];
  allSubjects: Subject[];
  allTeachers: Teacher[];
  allGroups: Group[];
  lesson: ExtendedLesson;
}

type FormData = z.infer<typeof lessonValidator> & {
  id: string;
};

const EditLessonForm: FC<EditLessonFormProps> = ({
  lesson,
  allClasses,
  allGroups,
  allRooms,
  allSubjects,
  allTeachers,
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Settings2 className="w-5 h-5 text-indigo-600" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytowanie lekcji</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany dla wybranej lekcji, następnie zapisz zmiany.
            </DialogDescription>
          </DialogHeader>
          <LessonForm
            lesson={lesson}
            allClasses={allClasses}
            allGroups={allGroups}
            allRooms={allRooms}
            allSubjects={allSubjects}
            allTeachers={allTeachers}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={"ghost"}>
          <Settings2 className="w-5 h-5 text-indigo-600" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-5/6">
        <DrawerHeader>
          <DrawerTitle>Edycja lekcji</DrawerTitle>
          <DrawerDescription>
            Wprowadź zmiany dla wybranej lekcji, następnie zapisz zmiany.
          </DrawerDescription>
        </DrawerHeader>

        <LessonForm
          lesson={lesson}
          allClasses={allClasses}
          allGroups={allGroups}
          allRooms={allRooms}
          allSubjects={allSubjects}
          allTeachers={allTeachers}
        />
      </DrawerContent>
    </Drawer>
  );
};

function LessonForm({
  lesson,
  allClasses,
  allGroups,
  allRooms,
  allSubjects,
  allTeachers,
}: EditLessonFormProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(lessonValidator),
    defaultValues: {
      lessonHour: lesson.lessonHour,
      dayOfWeek: lesson.dayOfWeek,
      roomId: lesson.roomId,
      subjectId: lesson.subjectId,
      classId: lesson.classId,
      teacherId: lesson.teacherId,
      groupId: lesson.groupId ? lesson.groupId : "undefined",
    },
  });

  const { mutate: editLesson, isLoading } = useMutation({
    mutationFn: async ({
      id,
      roomId,
      classId,
      groupId,
      subjectId,
      teacherId,
      lessonHour,
      dayOfWeek,
    }: FormData) => {
      const payload: FormData = {
        id,
        roomId,
        classId,
        groupId,
        subjectId,
        teacherId,
        lessonHour,
        dayOfWeek,
      };

      const { data } = await axios.patch("/api/lesson", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.error === "NoChangesDetected") {
          return toast.info("Brak zmian.", {
            description: "Nie wykryto żadnych zmian w lekcji.",
          });
        } else if (err.response?.data.error === "RoomAlreadyTaken") {
          form.setError("roomId", { message: "Sala jest już zajęta." });
          return toast.info("Sala jest zajęta.", {
            description: "Sala lekcyjna o tej godzinie jest już zajęta.",
          });
        }
      }
    },
    onSuccess: () => {
      toast.success("Lekcja została zaktualizowana pomyślnie.");
      router.refresh();
    },
  });

  return (
    <div className="w-full flex flex-col overflow-auto p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            editLesson({ ...data, id: lesson.id });
          })}
          className="grid items-start gap-4 px-4 max-w-xl w-full mx-auto"
        >
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
                    {allClasses.map((c) => (
                      <SelectItem key={c.id} value={`${c.id}`}>
                        {c.name}
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
                    {allSubjects.map((s) => (
                      <SelectItem key={s.id} value={`${s.id}`}>
                        {s.name}
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
                    {allTeachers.map((t) => (
                      <SelectItem key={t.id} value={`${t.id}`}>
                        {t.name} {t.surname}
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
                    {allRooms.map((r) => (
                      <SelectItem key={r.id} value={`${r.id}`}>
                        {r.name}
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
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dzień tygodnia</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz godzinę" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => (
                      <SelectItem key={`lesson-${i}`} value={`${i}`}>
                        {i}. {moment(lessonList[i].startDate).format("HH:mm")} -{" "}
                        {moment(lessonList[i].endDate).format("HH:mm")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {lesson.class.splitGroups && (
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
                        .filter((g) => g.classId === lesson.classId)
                        .map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            Grupa {g.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant={"destructive"}>
                  Usuń lekcję
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Czy jesteś tego pewien?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tej akcji nie można cofnąć. Spowoduje to trwałe usunięcie
                    lekcji z naszych serwerów.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/lesson`, {
                          data: { id: lesson.id },
                        });

                        toast.success("Pomyślnie usunięto lekcję.");
                        router.refresh();
                      } catch (err) {
                        if (err instanceof AxiosError) {
                          if (err.response?.data.error === "LessonNotFound") {
                            return toast.info(
                              "Lekcja którą chcesz usunąć, nie istnieje."
                            );
                          }
                        }

                        return toast.error("Coś poszło nie tak.", {
                          description:
                            "Wystąpił błąd podczas usuwania lekcji. Spróbuj ponownie później.",
                        });
                      }
                    }}
                  >
                    Usuń
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit" isLoading={isLoading}>
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditLessonForm;
