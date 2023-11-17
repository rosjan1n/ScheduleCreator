import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { classValidator } from "@/lib/validators/basic";
import { z } from "zod";

/* export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const group = await db.class.findFirst({
      where: {
        id: body.classId,
      },
    });

    if (!group) {
      return new Response("Klasa którą chcesz usunąć nie istnieje.", {
        status: 404,
      });
    }

    await db.class.delete({
      where: {
        id: body.classId,
      },
    });

    return new Response("OK");
  } catch {
    return new Response(
      "Wystąpił błąd podczas usuwania klasy. Spróbuj ponownie później.",
      {
        status: 500,
      }
    );
  }
} */

/* export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      amount,
      mainTeacherId,
      isGroup,
      amountOfFirstGroup,
      amountOfSecondGroup,
    } = classValidator.parse(body);

    const group = await db.class.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!group) {
      return new Response("Edytowana klasa nie istnieje.", { status: 404 });
    }

    if (
      group.name === name &&
      group.amount === amount &&
      group.mainTeacherId === mainTeacherId &&
      group.isGroup === checkIsGroup(isGroup) &&
      group.amountOfFirstGroup === (amountOfFirstGroup || null) &&
      group.amountOfSecondGroup === (amountOfSecondGroup || null)
    ) {
      return new Response("Niewykryto zmian. Klasa nie została edytowana.", {
        status: 400,
      });
    }

    // check if this class name already exist
    const takenName = await db.class.findFirst({
      where: {
        name,
        NOT: {
          id: {
            equals: body.id,
          },
        },
      },
    });

    if (takenName)
      return new Response(
        JSON.stringify({
          takenName: true,
        }),
        { status: 409 }
      );

    if (checkIsGroup(isGroup)) {
      if (
        amountOfFirstGroup === undefined ||
        amountOfSecondGroup === undefined
      ) {
        return new Response(
          JSON.stringify({
            amountOfGroupNotSpecified: true,
          }),
          { status: 409 }
        );
      } else if (
        amountOfFirstGroup + amountOfSecondGroup > amount ||
        amountOfFirstGroup + amountOfSecondGroup < amount
      ) {
        return new Response(JSON.stringify({ amountOfGroups: true }), {
          status: 409,
        });
      }
    }

    await db.class.update({
      where: {
        id: body.id,
      },
      data: {
        name,
        amount,
        mainTeacherId,
        isGroup: checkIsGroup(isGroup),
        amountOfFirstGroup: checkIsGroup(isGroup) ? amountOfFirstGroup : null,
        amountOfSecondGroup: checkIsGroup(isGroup) ? amountOfSecondGroup : null,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Wystąpił błąd podczas edycji klasy. Spróbuj ponownie później.",
      {
        status: 500,
      }
    );
  }
} */

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, mainTeacherId, amountOfStudents, groups } =
      classValidator.parse(body);

    // check if class name already exists
    const takenName = await db.class.findFirst({
      where: {
        name,
      },
    });

    if (takenName)
      return new Response(
        JSON.stringify({
          takenName: true,
        }),
        { status: 409 }
      );

    if (groups && groups.length > 0) {
      if (
        groups[0].amountOfStudents + groups[1].amountOfStudents !==
        amountOfStudents
      ) {
        return new Response(
          JSON.stringify({ invalidStudentsAmountGroup: true }),
          {
            status: 409,
          }
        );
      }

      // create class
      const createdClass = await db.class.create({
        data: {
          name,
          mainTeacherId,
          amountOfStudents,
        },
      });

      groups.forEach(async (group) => {
        await db.group.create({
          data: {
            amountOfStudents: group.amountOfStudents,
            classId: createdClass.id,
          },
        });
      });

      return new Response("Stworzono klasę wraz z grupami.");
    }

    // create class
    await db.class.create({
      data: {
        name,
        mainTeacherId,
        amountOfStudents,
      },
    });

    return new Response("Stworzono klasę.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Wystąpił błąd podczas tworzenia klasy. Spróbuj ponownie później.",
      { status: 500 }
    );
  }
}
