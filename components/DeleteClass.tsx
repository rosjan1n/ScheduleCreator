"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  classId: string;
}

const DeleteClass: FC<Props> = ({ classId }) => {
  const router = useRouter();
  const { mutate: deleteClass, isLoading } = useMutation({
    mutationFn: async ({ classId }: Props) => {
      const payload: Props = {
        classId,
      };

      await axios.delete("/api/class", { data: payload });
    },
    onError: () => {
      return toast({
        title: "Coś poszło nie tak.",
        description:
          "Wystąpił błąd podczas usuwania klasy. Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        toast({
          description: "Klasa została usunięta.",
        });
      });
    },
  });

  return (
    <Button
      variant={"ghost"}
      className="text-red-500 hover:text-red-500"
      onClick={() => deleteClass({ classId })}
      isLoading={isLoading}
    >
      <Trash className="w-5 h-5" />
    </Button>
  );
};

export default DeleteClass;
