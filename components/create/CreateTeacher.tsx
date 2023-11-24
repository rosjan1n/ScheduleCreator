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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { teacherValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

type formData = z.infer<typeof teacherValidator>;

const CreateTeacher = () => {
  const router = useRouter();
  const form = useForm<formData>({
    resolver: zodResolver(teacherValidator),
  });

  const { mutate: createTeacher, isLoading } = useMutation({
    mutationFn: async ({ name, surname }: formData) => {
      const payload: formData = { name, surname };

      const { data } = await axios.post("/api/teacher", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          form.setError("name", {
            message: "Nauczyciel o takich danych już istnieje.",
          });
          form.setError("surname", {
            message: "Nauczyciel o takich danych już istnieje.",
          });
          return;
        }
      }

      return toast({
        title: "Coś poszło nie tak.",
        description:
          "Nauczyciel nie został stworzony. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Nauczyciel został stworzony.",
      });
      router.push("/dashboard?tab=teachers");
      startTransition(() => {
        router.refresh();
      });
    },
  });
  return (
    <div className="rounded bg-muted p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createTeacher(data))}
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
                    <Input size={32} placeholder="Imię" {...field} />
                  </FormControl>
                  <FormDescription>
                    Wprowadź imię nauczyciela, imię nie może się powtarzać.
                  </FormDescription>
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
                    <Input size={32} placeholder="Nazwisko" {...field} />
                  </FormControl>
                  <FormDescription>
                    Wprowadź nazwisko nauczyciela, nazwisko nie może się
                    powtarzać.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Stwórz nauczyciela
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTeacher;
