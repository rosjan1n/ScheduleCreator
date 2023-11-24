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
import { subjectValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type formData = z.infer<typeof subjectValidator>;

const CreateSubject = () => {
  const router = useRouter();
  const form = useForm<formData>({
    resolver: zodResolver(subjectValidator),
  });

  const { mutate: createSubject, isLoading } = useMutation({
    mutationFn: async ({ name }: formData) => {
      const payload: formData = { name };

      const { data } = await axios.post("/api/subject", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return form.setError("name", {
            message: "Przedmiot o takiej nazwie już istnieje.",
          });
        }
      }

      return toast({
        title: "Coś poszło nie tak.",
        description:
          "Przedmiot nie został stworzony. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Przedmiot został stworzony.",
      });
      router.push("/dashboard?tab=subjects");
    },
  });
  return (
    <div className="rounded bg-muted p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createSubject(data))}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:w-[400px]">
                <FormLabel>Nazwa przedmiotu</FormLabel>
                <FormControl>
                  <Input size={32} placeholder="Nazwa" {...field} />
                </FormControl>
                <FormDescription>
                  Nazwa przedmiotu, który chcesz stworzyć.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Stwórz przedmiot
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSubject;
