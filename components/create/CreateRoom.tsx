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
import { roomValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

type formData = z.infer<typeof roomValidator>;

const CreateRoom = () => {
  const router = useRouter();
  const form = useForm<formData>({
    resolver: zodResolver(roomValidator),
  });

  const { mutate: createRoom, isLoading } = useMutation({
    mutationFn: async ({ name, capacity }: formData) => {
      const payload: formData = { name, capacity };

      const { data } = await axios.post("/api/room", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return form.setError("name", {
            message: "Sala o takiej nazwie już istnieje.",
          });
        }
      }

      return toast({
        title: "Coś poszło nie tak.",
        description: "Sala nie została stworzona. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Sala została stworzona.",
      });
      router.push("/dashboard");
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
    },
  });

  /* TODO: Wyszukiwanie klasy po nazwie */
  return (
    <div className="rounded bg-muted p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createRoom(data))}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col xl:flex-row gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:w-[400px]">
                  <FormLabel>Nazwa sali</FormLabel>
                  <FormControl>
                    <Input size={32} placeholder="Nazwa" {...field} />
                  </FormControl>
                  <FormDescription>
                    Wprowadź nazwę sali. Nazwa sali nie może się powtarzać.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="sm:w-[400px]">
                  <FormLabel>Pojemność sali</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      size={32}
                      placeholder="Pojemność"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Wprowadź ilość krzesełek w sali (1 krzesło = 1 osoba).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Stwórz salę
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRoom;
