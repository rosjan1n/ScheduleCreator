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
import { subjectValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Subject } from "@prisma/client";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  subject: Subject;
}

type FormData = z.infer<typeof subjectValidator> & {
  id: string;
};

const EditSubjectForm: FC<Props> = ({ subject }) => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(subjectValidator),
    defaultValues: {
      name: subject.name || undefined,
    },
  });

  const { mutate: editSubject, isLoading } = useMutation({
    mutationFn: async ({ id, name }: FormData) => {
      const payload: FormData = { id, name };

      const { data } = await axios.patch("/api/subject", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.error === "SubjectAlreadyExists") {
          return form.setError("name", {
            message: "Przedmiot o takiej nazwie już istnieje.",
          });
        } else if (err.response?.data.error === "NoChangesDetected") {
          return toast.info("Brak zmian.", {
            description: "Niewykryto zmian. Przedmiot nie został edytowany.",
          });
        } else if (err.response?.data.error === "SubjectNotFound") {
          return toast.info(
            "Przedmiot, który próbujesz edytować nie istnieje."
          );
        }

        return toast.error("Coś poszło nie tak.", {
          description:
            "Wystąpił błąd podczas edycji przedmiotu. Spróbuj ponownie później.",
        });
      }
    },
    onSuccess: () => {
      toast.success("Przedmiot został edytowany.");
      router.push("/dashboard?tab=subjects");
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
            editSubject({ ...data, id: subject.id });
          })}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa przedmiotu</FormLabel>
                  <FormControl>
                    <Input placeholder="Nazwa" size={32} {...field} />
                  </FormControl>
                  <FormDescription>Wprowadź nazwę przedmiotu.</FormDescription>
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
                if (confirm("Czy na pewno chcesz usunąć przedmiot?")) {
                  axios
                    .delete(`/api/subject`, {
                      data: { id: subject.id },
                    })
                    .then(() => {
                      toast.success("Pomyślnie usunięto przedmiot.");
                      router.push("/dashboard?tab=subjects");
                      startTransition(() => {
                        router.refresh();
                      });
                    })
                    .catch((err) => {
                      if (err instanceof AxiosError) {
                        if (err.response?.data.error === "SubjectNotFound") {
                          return toast.info(
                            "Przedmiot który chcesz usunąć, nie istnieje."
                          );
                        }
                      }

                      return toast.error("Coś poszło nie tak.", {
                        description:
                          "Wystąpił błąd podczas usuwania przedmiotu. Spróbuj ponownie później.",
                      });
                    });
                }
              }}
            >
              Usuń przedmiot
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSubjectForm;
