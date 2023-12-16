import { Class, Group, Lesson, Room, Subject, Teacher } from "@prisma/client";

export type ExtendedClass = Class & {
  mainTeacher: Teacher;
  groups: Group[];
  lessons: Lesson[];
};
export type ExtendedTeacher = Teacher & {
  lessons: Lesson[];
  assignedClass: Class | null;
};
export type ExtentedSubject = Subject & {
  lessons: Lesson[];
};
export type ExtendedRoom = Room & {
  lessons: Lesson[];
};
export type ExtendedLesson = Lesson & {
  room: Room;
  subject: Subject;
  teacher: Teacher;
  class: Class;
  group: Group | null;
};
