"use client";

import { ExtendedClass } from "@/types/db";
import { FC, startTransition, useState } from "react";
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
import { Teacher } from "@prisma/client";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
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
  const [splitGroups, setGroups] = useState(editedClass.groups.length > 0);

  const form = useForm<FormData>({
    resolver: zodResolver(classValidator),
    defaultValues: {
      name: editedClass.name || undefined,
      amountOfStudents: editedClass.amountOfStudents || undefined,
      mainTeacherId: editedClass.mainTeacherId || undefined,
      groups: [
        {
          amountOfStudents: editedClass.groups[0]?.amountOfStudents,
        },
        {
          amountOfStudents: editedClass.groups[1]?.amountOfStudents,
        },
      ],
    },
  });

  const { mutate: editClass, isLoading } = useMutation({
    mutationFn: async ({
      id,
      name,
      amountOfStudents,
      mainTeacherId,
      groups,
    }: FormData) => {
      const payload: FormData = {
        id,
        name,
        amountOfStudents,
        mainTeacherId,
        groups,
      };

      const { data } = await axios.patch("/api/class", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.takenName) {
          return form.setError("name", {
            message: "Podana nazwa klasy jest już zajęta.",
          });
        } else if (err.response?.status === 400) {
          return toast({
            title: "Brak zmian.",
            description: "Niewykryto zmian. Klasa nie została edytowana.",
          });
        }
      }

      return toast({
        title: "Coś poszło nie tak.",
        description:
          "Wystąpił błąd podczas edycji klasy. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Klasa została edytowana.",
      });
      router.push("/dashboard");
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
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
                  <FormLabel>Nazwa klasy</FormLabel>
                  <FormControl>
                    <Input placeholder="Nazwa" size={32} {...field} />
                  </FormControl>
                  <FormDescription>
                    Wprowadź nazwę klasy. Nazwa musi być unikalna.
                  </FormDescription>
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
                    Wprowadź ilość uczniów klasy.
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
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Podzielić klasę na 2 grupy?
              </label>
              <Select
                onValueChange={(selectedValue) =>
                  setGroups(selectedValue === "true")
                }
              >
                <SelectTrigger defaultValue={splitGroups ? "true" : "false"}>
                  <SelectValue placeholder="Wybierz tak/nie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Tak</SelectItem>
                  <SelectItem value="false">Nie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {splitGroups &&
              Array.from({ length: 2 }, (_, i) => (
                <FormField
                  key={i}
                  control={form.control}
                  name={`groups.${i}.amountOfStudents`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ilość uczniów grupy {i + 1}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ilość"
                          type="number"
                          size={32}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Wprowadź ilość uczniów grupy.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
          </div>
          <div className="flex justify-end">
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
