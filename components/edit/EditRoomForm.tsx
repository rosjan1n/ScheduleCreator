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
import { roomValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Room } from "@prisma/client";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  room: Room;
}

type FormData = z.infer<typeof roomValidator> & {
  id: string;
};

const EditRoomForm: FC<Props> = ({ room }) => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(roomValidator),
    defaultValues: {
      name: room.name,
      capacity: room.capacity,
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
        if (err.response?.data.error === "RoomAlreadyExists") {
          return form.setError("name", {
            message: "Sala o takiej nazwie już istnieje.",
          });
        } else if (err.response?.data.error === "NoChangesDetected") {
          return toast({
            title: "Brak zmian.",
            description: "Nie wykryto żadnych zmian w sali.",
            variant: "destructive",
          });
        } else if (err.response?.data.error === "RoomNotFound") {
          return toast({
            title: "Sala nie istnieje.",
            description: "Sala, którą próbujesz edytować nie istnieje.",
            variant: "destructive",
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
        title: "Sala została zaktualizowana.",
        description: "Sala została zaktualizowana pomyślnie.",
        variant: "default",
      });

      startTransition(() => {
        router.push("/dashboard?tab=rooms");
      });
    },
  });

  return (
    <div className="rounded bg-muted p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            editRoom({ ...data, id: room.id });
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
                    <Input
                      placeholder="Nazwa sali"
                      size={32}
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription>
                    Wprowadź nazwę sali, np. Sala 1.
                  </FormDescription>
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
                      placeholder="Pojemność sali"
                      size={32}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormDescription>
                    Wprowadź pojemność sali, np. 20.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant={"destructive"}
              onClick={() => {
                // delete confirmation
                if (confirm("Czy na pewno chcesz usunąć salę lekcyjną?")) {
                  axios
                    .delete(`/api/room`, {
                      data: { id: room.id },
                    })
                    .then(() => {
                      toast({
                        title: "Sukces!",
                        description: "Pomyślnie usunięto salę lekcyjną.",
                        variant: "default",
                      });
                      router.push("/dashboard?tab=rooms");
                      startTransition(() => {
                        router.refresh();
                      });
                    })
                    .catch((err) => {
                      if (err instanceof AxiosError) {
                        if (err.response?.data.error === "RoomNotFound") {
                          return toast({
                            title: "Nie można usunąć sali lekcyjnej.",
                            description:
                              "Salę którą chcesz usunąć, nie istnieje.",
                            variant: "destructive",
                          });
                        }
                      }

                      return toast({
                        title: "Coś poszło nie tak.",
                        description:
                          "Wystąpił błąd podczas usuwania sali. Spróbuj ponownie później.",
                        variant: "destructive",
                      });
                    });
                }
              }}
            >
              Usuń salę
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditRoomForm;
