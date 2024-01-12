"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2 } from "lucide-react";
import { ExtendedLesson } from "@/types/db";
import { useMediaQuery } from "@/hooks/use-media-query";

interface EditLessonFormProps {
  lesson: ExtendedLesson;
  day: number;
}

const EditLessonForm: FC<EditLessonFormProps> = ({ lesson, day }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Settings2 className="w-5 h-5 text-indigo-600" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytowanie lekcji</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany dla wybranej lekcji, następnie zapisz zmiany.
            </DialogDescription>
          </DialogHeader>
          <LessonForm lesson={lesson} day={day} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={"ghost"}>
          <Settings2 className="w-5 h-5 text-indigo-600" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edycja lekcji</DrawerTitle>
          <DrawerDescription>
            Wprowadź zmiany dla wybranej lekcji, następnie zapisz zmiany.
          </DrawerDescription>
        </DrawerHeader>

        <LessonForm lesson={lesson} day={day} />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Zamknij</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function LessonForm({ lesson, day }: EditLessonFormProps) {
  console.log(day);

  return (
    <form className="grid items-start gap-4 px-4">
      <div className="grid gap-2">
        <Label htmlFor="class">Klasa</Label>
        <Input id="class" defaultValue={lesson.class.name} disabled />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Dzień tygodnia</Label>
        <Select defaultValue={`${day}`}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz dzień tygodnia" />
          </SelectTrigger>
          <SelectContent>
            {["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"].map(
              (value, index) => (
                <SelectItem key={index} value={`${index + 1}`}>
                  {value}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit">Zapisz zmiany</Button>
        <Button type="button" variant={"outline"}>
          Usuń lekcję
        </Button>
      </div>
    </form>
  );
}

export default EditLessonForm;
