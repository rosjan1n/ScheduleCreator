/* import { z } from "zod";

export const editClassValidator = z.object({
  name: z
    .string({ required_error: "Nazwa klasy jest wymagana." })
    .min(1, "Nazwa klasy nie może być krótsza niż 1 znak.")
    .max(30, "Nazwa klasy nie może być dłuższa niż 30 znaków"),
  amount: z.coerce
    .number({ invalid_type_error: "Wprowadź liczbę." })
    .gte(1, "Liczba uczniów musi być większa lub równa 1.")
    .lte(100, "Liczba uczniów musi być mniejsza lub równa 100."),
  mainTeacher: z.string({ required_error: "Wychowawca klasy jest wymagany." }),
  isGroup: z.string({
    required_error: "Wybierz czy podzielić klasę na 2 grupy.",
  }),
  amountOfFirstGroup: z.coerce
    .number({
      invalid_type_error: "Wprowadź liczbę",
      required_error: "Ilość uczniów w 1 grupie jest wymagana.",
    })
    .gte(1, "Ilość uczniów musi być większa lub równa 1.")
    .lte(100, "Ilość uczniów musi być mniejsza lub równa 100."),
  amountOfSecondGroup: z.coerce
    .number({
      invalid_type_error: "Wprowadź liczbę",
      required_error: "Ilość uczniów w 2 grupie jest wymagana.",
    })
    .gte(1, "Ilość uczniów musi być większa lub równa 1.")
    .lte(100, "Ilość uczniów musi być mniejsza lub równa 100."),
});

export const editLessonValidator = z.object({
  dayOfWeek: z.string({ required_error: "Dzień tygodnia jest wymagany." }),
  lessonHour: z.string({ required_error: "Godzina lekcyjna jest wymagana." }),
  group: z.string().optional(),
  room: z.string({ required_error: "Numer klasy jest wymagany." }),
  teacher: z.string({ required_error: "Nauczyciel jest wymagany." }),
  subject: z.string({ required_error: "Przedmiot jest wymagany." }),
});
 */
