import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { classValidator } from "@/lib/validators/basic";
import { Group } from "@prisma/client";
import { z } from "zod";

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // check if class exists
    const classToDelete = await db.class.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!classToDelete) {
      return new Response(JSON.stringify({ error: "ClassNotFound" }), {
        status: 404,
      });
    }

    // delete class
    await db.class.delete({
      where: {
        id: body.id,
      },
    });

    return new Response("Pomyślnie usunięto klasę.");
  } catch {
    return new Response(
      "Wystąpił błąd podczas usuwania klasy. Spróbuj ponownie później.",
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
    const { name, mainTeacherId, amountOfStudents, splitGroups, groups } =
      classValidator.parse(body);

    const classToUpdate = await db.class.findFirst({
      where: {
        id: body.id,
      },
      include: {
        groups: true,
      },
    });

    if (!classToUpdate) {
      return new Response(JSON.stringify({ error: "ClassNotFound" }), {
        status: 404,
      });
    }

    if (
      classToUpdate.name === name &&
      classToUpdate.mainTeacherId === mainTeacherId &&
      classToUpdate.amountOfStudents === amountOfStudents &&
      classToUpdate.splitGroups === splitGroups &&
      classToUpdate.groups[0]?.amountOfStudents ===
        groups[0]?.amountOfStudents &&
      classToUpdate.groups[1]?.amountOfStudents === groups[1]?.amountOfStudents
    ) {
      return new Response(JSON.stringify({ error: "NoChangesDetected" }), {
        status: 400,
      });
    }

    // check if class name already exists
    const takenName = await db.class.findFirst({
      where: {
        name,
      },
    });

    if (takenName && takenName.id !== body.id) {
      return new Response(JSON.stringify({ error: "ClassAlreadyExists" }), {
        status: 409,
      });
    }

    // check if class is split
    if (splitGroups) {
      if (
        groups[0].amountOfStudents !== undefined &&
        groups[1].amountOfStudents !== undefined
      ) {
        if (
          groups[0].amountOfStudents + groups[1].amountOfStudents !==
          amountOfStudents
        ) {
          return new Response(
            JSON.stringify({ error: "InvalidGroupStudentsSum" }),
            { status: 409 }
          );
        }

        // update class with groups
        await db.class.update({
          where: {
            id: body.id,
          },
          data: {
            name,
            mainTeacherId,
            amountOfStudents,
            splitGroups,
          },
        });

        const groupsToUpdate = await db.group.findMany({
          where: {
            classId: body.id,
          },
        });

        if (groupsToUpdate.length === 0) {
          groups.forEach(async (group) => {
            await db.group.create({
              data: {
                amountOfStudents: group.amountOfStudents!,
                name: group.name!,
                classId: body.id,
              },
            });
          });
        } else {
          groupsToUpdate.forEach(async (group: Group, index) => {
            await db.group.update({
              where: {
                id: group.id,
              },
              data: {
                amountOfStudents: groups[index].amountOfStudents,
                name: groups[index].name,
              },
            });
          });
        }

        return new Response("Pomyślnie edytowano klasę z grupami.");
      } else {
        return new Response(
          JSON.stringify({ error: "GroupStudentsRequired" }),
          { status: 409 }
        );
      }
    }

    // update class
    await db.class.update({
      where: {
        id: body.id,
      },
      data: {
        name,
        mainTeacherId,
        amountOfStudents,
        splitGroups,
      },
    });

    // delete groups if class is not split
    await db.group.deleteMany({
      where: {
        classId: body.id,
      },
    });

    return new Response("Pomyślnie edytowano klasę.");
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
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, mainTeacherId, amountOfStudents, splitGroups, groups } =
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
          error: "ClassAlreadyExists",
        }),
        { status: 409 }
      );

    // check if class is split
    if (splitGroups) {
      if (
        groups[0].amountOfStudents !== undefined &&
        groups[0].name !== undefined &&
        groups[1].amountOfStudents !== undefined &&
        groups[1].name !== undefined
      ) {
        if (
          groups[0].amountOfStudents + groups[1].amountOfStudents !==
          amountOfStudents
        ) {
          return new Response(
            JSON.stringify({ error: "InvalidGroupStudentsSum" }),
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
            splitGroups,
          },
        });

        groups.forEach(async (group) => {
          await db.group.create({
            data: {
              amountOfStudents: group.amountOfStudents!,
              name: group.name!,
              classId: createdClass.id,
            },
          });
        });

        return new Response("Stworzono klasę z grupami.");
      } else {
        return new Response(
          JSON.stringify({ error: "GroupStudentsRequired" }),
          { status: 409 }
        );
      }
    }

    // create class
    await db.class.create({
      data: {
        name,
        mainTeacherId,
        amountOfStudents,
        splitGroups,
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
