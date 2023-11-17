import { Class, Group, Lesson, Room, Subject, Teacher } from "@prisma/client";

export type ExtendedClass = Class & {
  mainTeacher: Teacher;
  groups: Group[];
};
export type BasicClass = Class;
export type BasicTeacher = Teacher;
export type BasicSubject = Subject;
export type BasicRoom = Room;
export type ExtendedLesson = Lesson & {
  room: Room;
  subject: Subject;
  teacher: Teacher;
};
