import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { roomValidator } from "@/lib/validators/basic";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, capacity } = roomValidator.parse(body);

    const room = await db.room.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!room)
      return new Response("Edytowana sala nie istnieje.", { status: 404 });

    if (room.name === name && room.capacity === capacity)
      return new Response("Niewykryto zmian. Sala nie została edytowana.", {
        status: 400,
      });

    // check if room already exists
    const takenRoom = await db.room.findFirst({
      where: {
        name,
      },
    });

    if (takenRoom) {
      return new Response("Sala o takiej nazwie już istnieje.", {
        status: 409,
      });
    }

    // create room
    await db.room.update({
      where: {
        id: body.id,
      },
      data: {
        name,
        capacity,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Wystąpił błąd podczas edycji sali. Spróbuj ponownie później.",
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
    const { name, capacity } = roomValidator.parse(body);

    // check if room already exists
    const roomExists = await db.room.findFirst({
      where: {
        name,
      },
    });

    if (roomExists) {
      return new Response("Sala o takiej nazwie już istnieje.", {
        status: 409,
      });
    }

    // create room
    await db.room.create({
      data: {
        name,
        capacity,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Wystąpił błąd podczas tworzenia sali lekcyjnej. Spróbuj ponownie później.",
      { status: 500 }
    );
  }
}
