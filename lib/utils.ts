import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const lessonList = [
  {
    startDate: new Date().setHours(7, 10),
    endDate: new Date().setHours(7, 55),
    break: 5,
  },
  {
    startDate: new Date().setHours(8, 0),
    endDate: new Date().setHours(8, 45),
    break: 10,
  },
  {
    startDate: new Date().setHours(8, 55),
    endDate: new Date().setHours(9, 40),
    break: 10,
  },
  {
    startDate: new Date().setHours(9, 50),
    endDate: new Date().setHours(10, 35),
    break: 15,
  },
  {
    startDate: new Date().setHours(10, 50),
    endDate: new Date().setHours(11, 35),
    break: 10,
  },
  {
    startDate: new Date().setHours(11, 45),
    endDate: new Date().setHours(12, 30),
    break: 10,
  },
  {
    startDate: new Date().setHours(12, 40),
    endDate: new Date().setHours(13, 25),
    break: 15,
  },
  {
    startDate: new Date().setHours(13, 40),
    endDate: new Date().setHours(14, 25),
    break: 10,
  },
  {
    startDate: new Date().setHours(14, 35),
    endDate: new Date().setHours(15, 20),
    break: 10,
  },
  {
    startDate: new Date().setHours(15, 30),
    endDate: new Date().setHours(16, 15),
    break: 10,
  },
  {
    startDate: new Date().setHours(16, 25),
    endDate: new Date().setHours(17, 10),
    break: 10,
  },
  {
    startDate: new Date().setHours(17, 20),
    endDate: new Date().setHours(18, 5),
    break: 10,
  },
  {
    startDate: new Date().setHours(18, 15),
    endDate: new Date().setHours(19, 0),
    break: 5,
  },
  {
    startDate: new Date().setHours(19, 5),
    endDate: new Date().setHours(19, 50),
    break: 5,
  },
  {
    startDate: new Date().setHours(19, 55),
    endDate: new Date().setHours(20, 40),
  },
];
