"use client";

import { ExtendedClass } from "@/types/db";
import { FC, startTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { classValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { Teacher } from "@prisma/client";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  editedClass: ExtendedClass;
  freeTeachers: Teacher[];
}

type FormData = z.infer<typeof classValidator> & {
  id: string;
};

const EditClassForm: FC<Props> = ({ editedClass, freeTeachers }) => {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(classValidator),
    defaultValues: {
      name: editedClass.name,
      amountOfStudents: editedClass.amountOfStudents,
      mainTeacherId: editedClass.mainTeacherId,
      groups: editedClass.groups,
      splitGroups: editedClass.groups.length === 2,
    },
  });

  const { mutate: editClass, isLoading } = useMutation({
    mutationFn: async ({
      id,
      name,
      amountOfStudents,
      mainTeacherId,
      splitGroups,
      groups,
    }: FormData) => {
      const payload: FormData = {
        id,
        name,
        amountOfStudents,
        mainTeacherId,
        splitGroups,
        groups,
      };

      const { data } = await axios.patch("/api/class", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.error === "ClassAlreadyExists") {
          return form.setError("name", {
            message: "Podana nazwa klasy jest już zajęta.",
          });
        } else if (err.response?.data.error === "NoChangesDetected") {
          return toast.info("Brak zmian.", {
            description: "Nie wykryto żadnych zmian.",
          });
        } else if (err.response?.data.error === "InvalidGroupStudentsSum") {
          for (let i = 0; i <= 1; i++) {
            form.setError(`groups.${i}.amountOfStudents`, {
              message:
                "Suma uczniów w grupach musi być równa ilości uczniów w klasie.",
            });
          }
          return;
        }
      }

      return toast.error("Coś poszło nie tak.", {
        description:
          "Wystąpił błąd podczas edycji klasy. Spróbuj ponownie później.",
      });
    },
    onSuccess: () => {
      toast.success("Pomyślnie zaktualizowano klasę.");
      router.push("/dashboard?tab=classes");

      startTransition(() => {
        router.refresh();
      });
    },
  });

  return (
    <div className="rounded bg-muted p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            data.id = editedClass.id;

            editClass(data);
          })}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nazwa"
                      type="text"
                      size={32}
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription>Wprowadź nazwę klasy.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountOfStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ilość uczniów</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ilość"
                      type="number"
                      size={32}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Wprowadź ilość uczniów w klasie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainTeacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wychowawca</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz wychowawce" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={editedClass.mainTeacherId}>
                        {editedClass.mainTeacher.name}{" "}
                        {editedClass.mainTeacher.surname}
                      </SelectItem>
                      {freeTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} {teacher.surname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Wybierz wychowawce klasy.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="splitGroups"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Podziel na grupy</FormLabel>
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(!field.value);

                        const isChecked = e.target.checked;
                        isChecked === false
                          ? form.resetField("groups.0.amountOfStudents")
                          : null;
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Zaznacz, jeśli chcesz podzielić klasę na dwie grupy.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch().splitGroups === true &&
              Array.from({ length: 2 }, (_, i) => (
                <>
                  <FormField
                    key={i}
                    control={form.control}
                    name={`groups.${i}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grupa {i + 1}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nazwa grupy"
                            size={32}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Wprowadź nazwę grupy {i + 1}.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={i}
                    control={form.control}
                    name={`groups.${i}.amountOfStudents`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grupa {i + 1}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ilość uczniów"
                            type="number"
                            size={32}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Wprowadź ilość uczniów grupy {i + 1}.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ))}
          </div>
          <div className="flex gap-2 justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant={"destructive"}>
                  Usuń klasę
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Czy jesteś tego pewien?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tej akcji nie można cofnąć. Spowoduje to trwałe usunięcie
                    klasy z naszych serwerów.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/class`, {
                          data: { id: editedClass.id },
                        });

                        toast.success("Pomyślnie usunięto klasę.");
                        router.push("/dashboard");
                        router.refresh();
                      } catch (err) {
                        if (err instanceof AxiosError) {
                          if (err.response?.data.error === "ClassNotFound") {
                            return toast.info(
                              "Klasa którą chcesz usunąć, nie istnieje."
                            );
                          }
                        }

                        return toast.error("Coś poszło nie tak.", {
                          description:
                            "Wystąpił błąd podczas usuwania klasy. Spróbuj ponownie później.",
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
};

export default EditClassForm;
