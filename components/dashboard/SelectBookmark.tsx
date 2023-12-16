"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Library } from "lucide-react";
import { useRouter } from "next/navigation";

interface SelectBookmarkProps {
  currentTab: string;
  isForms?: boolean;
}

const SelectBookmark = ({ currentTab, isForms }: SelectBookmarkProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Library className="w-5 h-5" />
      <Select
        value={currentTab}
        onValueChange={(value) => {
          router.push(`?tab=${value}`);
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Wybierz zakładkę" />
        </SelectTrigger>
        <SelectContent>
          {isForms
            ? ["class", "teacher", "subject", "room", "lesson"].map(
                (tab, index) => (
                  <SelectItem value={tab} key={`${tab}-${index}`}>
                    {tab === "class" && "Klasa"}
                    {tab === "teacher" && "Nauczyciel"}
                    {tab === "subject" && "Przedmiot"}
                    {tab === "room" && "Sala"}
                    {tab === "lesson" && "Lekcja"}
                  </SelectItem>
                )
              )
            : ["classes", "teachers", "subjects", "rooms", "lessons"].map(
                (tab, index) => (
                  <SelectItem value={tab} key={`${tab}-${index}`}>
                    {tab === "classes" && "Klasy"}
                    {tab === "teachers" && "Nauczyciele"}
                    {tab === "subjects" && "Przedmioty"}
                    {tab === "rooms" && "Sale"}
                    {tab === "lessons" && "Lekcje"}
                  </SelectItem>
                )
              )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBookmark;
