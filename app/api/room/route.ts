import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { roomValidator } from "@/lib/validators/basic";
import { z } from "zod";

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log(body);

    // check if room exists
    const roomToDelete = await db.room.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!roomToDelete) {
      return new Response(JSON.stringify({ error: "RoomNotFound" }), {
        status: 404,
      });
    }

    // delete room
    await db.room.delete({
      where: {
        id: body.id,
      },
    });

    return new Response("Pomyślnie usunięto salę lekcyjną.");
  } catch {
    return new Response(
      "Wystąpił błąd podczas usuwania sali. Spróbuj ponownie później.",
      {
        status: 500,
      }
    );
  }
}

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
      return new Response(JSON.stringify({ error: "RoomNotFound" }), {
        status: 404,
      });

    if (room.name === name && room.capacity === capacity)
      return new Response(JSON.stringify({ error: "NoChangesDetected" }), {
        status: 400,
      });

    // check if room already exists
    const takenRoom = await db.room.findFirst({
      where: {
        name,
      },
    });

    if (takenRoom && takenRoom.id !== body.id) {
      return new Response(JSON.stringify({ error: "RoomAlreadyExists" }), {
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

    return new Response("Pomyślnie edytowano salę lekcyjną.");
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
