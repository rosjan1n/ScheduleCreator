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
      router.push("/dashboard");
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
          <div className="flex flex-col xl:flex-row gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:w-[400px]">
                  <FormLabel>Imię nauczyciela</FormLabel>
                  <FormControl>
                    <Input size={32} placeholder="Imię" {...field} />
                  </FormControl>
                  <FormDescription>
                    Dane nauczyciela nie mogą się powtarzać z innym utworzonym
                    nauczycielem.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="sm:w-[400px]">
                  <FormLabel>Nazwisko nauczyciela</FormLabel>
                  <FormControl>
                    <Input size={32} placeholder="Nazwisko" {...field} />
                  </FormControl>
                  <FormDescription>
                    Dane nauczyciela nie mogą się powtarzać z innym utworzonym
                    nauczycielem.
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
