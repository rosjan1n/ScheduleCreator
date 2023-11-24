import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColStartClass(dayOfWeek: number) {
  switch (dayOfWeek) {
    case 1:
      return "col-start-1";
    case 2:
      return "col-start-2";
    case 3:
      return "col-start-3";
    case 4:
      return "col-start-4";
    case 5:
      return "col-start-5";

    default:
      return "";
  }
}

export function getRowStartClass(lessonHour: number) {
  switch (lessonHour) {
    case 0:
      return "row-start-2";
    case 1:
      return "row-start-3";
    case 2:
      return "row-start-4";
    case 3:
      return "row-start-5";
    case 4:
      return "row-start-6";
    case 5:
      return "row-start-7";
    case 6:
      return "row-start-8";
    case 7:
      return "row-start-9";
    case 8:
      return "row-start-10";
    case 9:
      return "row-start-11";
    case 10:
      return "row-start-12";
    case 11:
      return "row-start-13";
    case 12:
      return "row-start-14";
    case 13:
      return "row-start-15";
    case 14:
      return "row-start-16";
    case 15:
      return "row-start-17";

    default:
      return "";
  }
}

export function getNameOfDay(day: number) {
  switch (day) {
    case 0:
      return "Poniedziałek";
    case 1:
      return "Wtorek";
    case 2:
      return "Środa";
    case 3:
      return "Czwartek";
    case 4:
      return "Piątek";
    default:
      break;
  }
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
