import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { teacherValidator } from "@/lib/validators/basic";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, surname } = teacherValidator.parse(body);

    const teacher = await db.teacher.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!teacher)
      return new Response("Edytowany nauczyciel nie istnieje.", {
        status: 404,
      });
    if (teacher.name === name && teacher.surname === surname)
      return new Response(
        "Niewykryto zmian. Nauczyciel nie został edytowany.",
        { status: 400 }
      );

    // check if teacher already exists
    const teacherExists = await db.teacher.findFirst({
      where: {
        name,
        surname,
      },
    });

    if (teacher.name !== name && teacher.surname !== surname && teacherExists) {
      return new Response(JSON.stringify({ teacherExists: true }), {
        status: 409,
      });
    }

    // update teacher
    await db.teacher.update({
      where: {
        id: body.id,
      },
      data: {
        name,
        surname,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Wystąpił błąd podczas edycji nauczyciela.", {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, surname } = teacherValidator.parse(body);

    // check if teacher already exists
    const teacherExists = await db.teacher.findFirst({
      where: {
        name,
        surname,
      },
    });

    if (teacherExists) {
      return new Response("Nauczyciel o takich danych już istnieje.", {
        status: 409,
      });
    }

    // create teacher
    await db.teacher.create({
      data: {
        name,
        surname,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Nie można było stworzyć nauczyciela.", {
      status: 500,
    });
  }
}
