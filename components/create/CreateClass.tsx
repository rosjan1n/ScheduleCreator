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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { classValidator } from "@/lib/validators/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Teacher } from "@prisma/client";
import { FC, startTransition, useState } from "react";

interface Props {
  teachers: Teacher[];
}

type formData = z.infer<typeof classValidator>;

const CreateClass: FC<Props> = ({ teachers }) => {
  const router = useRouter();
  const form = useForm<formData>({
    resolver: zodResolver(classValidator),
  });

  const [splitGroups, setGroups] = useState(false);

  const { mutate: createClass, isLoading } = useMutation({
    mutationFn: async ({
      name,
      amountOfStudents,
      mainTeacherId,
      groups,
    }: formData) => {
      const payload: formData = {
        name,
        amountOfStudents,
        mainTeacherId,
        groups,
      };

      const { data } = await axios.post("/api/class", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.takenName) {
          return form.setError("name", {
            message: "Podana nazwa klasy jest już zajęta.",
          });
        } else if (err.response?.data.invalidStudentsAmountGroup) {
          for (let i = 0; i <= 1; i++) {
            form.setError(`groups.${i}.amountOfStudents`, {
              message:
                "Suma ilości uczniów obu grup, nie zgadza się z liczbą uczniów całej klasy.",
            });
          }
          return;
        }
      }

      return toast({
        title: "Coś poszło nie tak.",
        description:
          "Wystąpił błąd podczas tworzenia klasy. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Klasa została stworzona.",
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
          onSubmit={form.handleSubmit((data) => createClass(data))}
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
                      {teachers.map((teacher) => (
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
                <SelectTrigger>
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
              Stwórz klasę
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateClass;
