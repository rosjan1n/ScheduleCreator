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
import { createRoomValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Room, Subject } from "@prisma/client";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  room: Room;
}

type FormData = z.infer<typeof createRoomValidator> & {
  id: string;
};

const EditRoomForm: FC<Props> = ({ room }) => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(createRoomValidator),
    defaultValues: {
      name: room.name || undefined,
      capacity: room.capacity || undefined,
    },
  });

  const { mutate: editRoom, isLoading } = useMutation({
    mutationFn: async ({ id, name, capacity }: FormData) => {
      const payload: FormData = { id, name, capacity };

      const { data } = await axios.patch("/api/room", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.teacherExist) {
          form.setError("name", {
            message: "Sala o takiej nazwie już istnieje.",
          });
          return;
        } else if (err.response?.status === 400) {
          return toast({
            title: "Brak zmian.",
            description: "Niewykryto zmian. Sala nie została edytowana.",
          });
        }
      }

      return toast({
        title: "Coś poszło nie tak.",
        description:
          "Wystąpił błąd podczas edycji sali. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Sala została edytowana.",
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
            data.id = room.id;

            editRoom(data);
          })}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa sali</FormLabel>
                  <FormControl>
                    <Input placeholder="Nazwa" size={32} {...field} />
                  </FormControl>
                  <FormDescription>Wprowadź nazwę sali.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pojemność sali</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pojemność"
                      type="number"
                      size={32}
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
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditRoomForm;
