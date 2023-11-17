import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subjectValidator } from "@/lib/validators/basic";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = subjectValidator.parse(body);

    const subject = await db.subject.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!subject)
      return new Response("Edytowany przedmiot nie istnieje.", { status: 404 });

    if (subject.name === name)
      return new Response("Niewykryto zmian. Przedmiot nie został edytowany.", {
        status: 400,
      });

    // check if subject already exists
    const takenSubject = await db.subject.findFirst({
      where: {
        name,
      },
    });

    if (takenSubject) {
      return new Response("Przedmiot o takiej nazwie już istnieje.", {
        status: 409,
      });
    }

    // update subject
    await db.subject.update({
      where: {
        id: body.id,
      },
      data: {
        name,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Wystąpił błąd podczas edycji przedmiotu. Spróbuj ponownie później.",
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = subjectValidator.parse(body);

    // check if subject already exists
    const takenSubject = await db.subject.findFirst({
      where: {
        name,
      },
    });

    if (takenSubject) {
      return new Response("Przedmiot o takiej nazwie już istnieje.", {
        status: 409,
      });
    }

    // create subject
    await db.subject.create({
      data: {
        name,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Wystąpił błąd podczas tworzenia przedmiotu. Spróbuj ponownie później.",
      { status: 500 }
    );
  }
}
