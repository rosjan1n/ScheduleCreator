import { z } from "zod";

export const roomValidator = z.object({
  name: z
    .string({ required_error: "Nazwa klasy jest wymagana." })
    .min(2, "Nazwa klasy nie może być krótsza niż 2 znaki.")
    .max(10, "Nazwa klasy nie może być dłuższa niż 10 znaków."),
  capacity: z.coerce
    .number()
    .gte(1, "Pojemność klasy musi być większa lub równa 1.")
    .lte(100, "Pojemność klasy musi być mniejsza lub równa 100."),
});

export const teacherValidator = z.object({
  name: z
    .string({ required_error: "Imię nauczyciela jest wymagane." })
    .min(3, "Imię nauczyciela nie może być krótsze niż 3 znaki.")
    .max(15, "Imię nauczyciela nie może być dłuższe niż 15 znaków."),
  surname: z
    .string({ required_error: "Nazwisko nauczyciela jest wymagane." })
    .min(3, "Nazwisko nauczyciela nie może być krótsze niż 3 znaki.")
    .max(40, "Nazwisko nauczyciela nie może być dłuższe niż 40 znaków."),
});

export const subjectValidator = z.object({
  name: z
    .string({ required_error: "Nazwa przedmiotu jest wymagana." })
    .min(2, "Nazwa przedmiotu nie może być krótsza niż 2 znaki.")
    .max(30, "Nazwa przedmiotu nie może być dłuższa niż 30 znaków."),
});

export const classValidator = z.object({
  name: z
    .string({ required_error: "Nazwa klasy jest wymagana." })
    .min(2, "Nazwa klasy nie może być krótsza niż 2 znaki.")
    .max(10, "Nazwa klasy nie może być dłuższa niż 10 znaków."),
  mainTeacherId: z
    .string({ required_error: "Wychowawca klasy jest wymagany." })
    .min(1),
  amountOfStudents: z.coerce
    .number({ required_error: "Ilość osób w klasie jest wymagane." })
    .lte(100, "Liczba osób w klasie nie może być większa niż 100 osób.")
    .gte(1, "Liczba osób w klasie nie może być mniejsza niż 1."),
  /* TODO: Handle group select */
  groups: z
    .object({
      amountOfStudents: z.coerce
        .number({ required_error: "Ilość osób w grupie jest wymagane." })
        .lte(100, "Liczba osób w grupie nie może być większa niż 100 osób.")
        .gte(1, "Liczba osób w grupie nie może być mniejsza niż 1."),
    })
    .array()
    .optional(),
});

export const lessonValidator = z.object({
  dayOfWeek: z.coerce
    .number({
      required_error: "Dzień tygodnia jest wymagany.",
    })
    .gte(1)
    .lte(5),
  lessonHour: z.coerce
    .number({
      required_error: "Godzina lekcyjna jest wymagana.",
    })
    .gte(0)
    .lte(14),
  groupId: z.string().min(1).optional(),
  roomId: z.string({ required_error: "Sala lekcyjna jest wymagana." }).min(1),
  subjectId: z.string({ required_error: "Przedmiot jest wymagany." }).min(1),
  classId: z.string({ required_error: "Klasa jest wymagana." }).min(1),
  teacherId: z.string({ required_error: "Nauczyciel jest wymagany." }).min(1),
});

/* export const createScheduleValidator = z.object({
  lesson: z
    .object({
      dayOfWeek: z.string({
        required_error: "Dzień tygodnia jest wymagany.",
      }),
      lessonHour: z.string({
        required_error: "Godzina lekcyjna jest wymagana.",
      }),
      group: z.string().optional(),
      roomId: z
        .string({ required_error: "Sala lekcyjna jest wymagana." })
        .min(1),
      subjectId: z
        .string({ required_error: "Przedmiot jest wymagany." })
        .min(1),
      classId: z.string({ required_error: "Klasa jest wymagana." }).min(1),
      teacherId: z
        .string({ required_error: "Nauczyciel jest wymagany." })
        .min(1),
    })
    .array(),
}); */
