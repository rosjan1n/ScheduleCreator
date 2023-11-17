"use client";

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
import { teacherValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Teacher } from "@prisma/client";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  teacher: Teacher;
}

type FormData = z.infer<typeof teacherValidator> & {
  id: string;
};

const EditTeacherForm: FC<Props> = ({ teacher }) => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(teacherValidator),
    defaultValues: {
      name: teacher.name || undefined,
      surname: teacher.surname || undefined,
    },
  });

  const { mutate: editTeacher, isLoading } = useMutation({
    mutationFn: async ({ id, name, surname }: FormData) => {
      const payload: FormData = { id, name, surname };

      const { data } = await axios.patch("/api/teacher", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.teacherExist) {
          form.setError("name", {
            message: "Nauczyciel o takich danych już istnieje.",
          });
          form.setError("surname", {
            message: "Nauczyciel o takich danych już istnieje.",
          });
          return;
        } else if (err.response?.status === 400) {
          return toast({
            title: "Brak zmian.",
            description: "Niewykryto zmian. Nauczyciel nie został edytowany.",
          });
        }
      }

      return toast({
        title: "Coś poszło nie tak.",
        description:
          "Wystąpił błąd podczas edycji nauczyciela. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Nauczyciel został edytowany.",
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
            data.id = teacher.id;

            editTeacher(data);
          })}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię nauczyciela</FormLabel>
                  <FormControl>
                    <Input placeholder="Imię" size={32} {...field} />
                  </FormControl>
                  <FormDescription>Wprowadź imię nauczyciela.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwisko nauczyciela</FormLabel>
                  <FormControl>
                    <Input placeholder="Nazwisko" size={32} {...field} />
                  </FormControl>
                  <FormDescription>
                    Wprowadź nazwisko nauczyciela.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default EditTeacherForm;
