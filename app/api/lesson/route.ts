import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { editLessonValidator } from "@/lib/validators/edit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { lessonHour, dayOfWeek, room, teacher, subject, group } =
      editLessonValidator.parse(body);

    let convertedLessonHour = Number(lessonHour);
    let convertedDayOfWeek = Number(dayOfWeek);
    let convertedGroup = Number(group);

    // check if lesson exists if so delete it
    const lessonExists = await db.lesson.findFirst({
      where: {
        lessonHour: convertedLessonHour,
        dayOfWeek: convertedDayOfWeek + 1,
        classId: body.classId,
        group: convertedGroup || undefined,
      },
    });

    // check if the teacher is busy if so return conflict
    const busyTeacher = await db.lesson.findFirst({
      where: {
        dayOfWeek: convertedDayOfWeek + 1,
        lessonHour: convertedLessonHour,
        teacherId: teacher,
        class: {
          name: {
            not: {
              equals: body.cohort.name,
            },
          },
        },
      },
    });

    // check if room is busy
    const busyRoom = await db.lesson.findFirst({
      where: {
        dayOfWeek: convertedDayOfWeek + 1,
        lessonHour: convertedLessonHour,
        room: {
          id: room,
        },
        class: {
          name: {
            not: {
              equals: body.cohort.name,
            },
          },
        },
      },
      include: {
        class: true,
      },
    });

    if (busyRoom) {
      return new Response(JSON.stringify({ busyRoom }), { status: 409 });
    }

    // select data of room
    const foundRoom = await db.room.findFirst({
      where: {
        id: room,
      },
    });

    if (!group) {
      // check if group of class is busy
      const busyGroup = await db.lesson.findFirst({
        where: {
          dayOfWeek: convertedDayOfWeek + 1,
          lessonHour: convertedLessonHour,
          group: {
            not: undefined,
          },
          class: {
            name: body.cohort.name,
          },
        },
      });
      if (busyGroup) {
        return new Response(JSON.stringify({ busyGroup: true }), {
          status: 409,
        });
      }
    }

    if (busyTeacher) {
      return new Response(JSON.stringify({ teacher: true }), {
        status: 409,
      });
    }

    if (foundRoom) {
      if (group) {
        if (
          (convertedGroup === 1 &&
            foundRoom.capacity < body.cohort.amountOfFirstGroup) ||
          (convertedGroup === 2 &&
            foundRoom.capacity < body.cohort.amountOfSecondGroup)
        ) {
          return new Response(JSON.stringify({ room: true }), { status: 409 });
        }
      } else {
        if (foundRoom.capacity < body.cohort.amount) {
          return new Response(JSON.stringify({ room: true }), { status: 409 });
        }
      }
    }

    if (lessonExists) {
      await db.lesson.delete({
        where: {
          id: lessonExists.id,
        },
      });
    }

    // create lesson
    await db.lesson.create({
      data: {
        lessonHour: convertedLessonHour,
        dayOfWeek: convertedDayOfWeek + 1,
        group: convertedGroup || undefined,
        roomId: room,
        classId: body.cohort.id,
        teacherId: teacher,
        subjectId: subject,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Nie można stworzyć lekcji. Spróbuj ponownie później.",
      { status: 500 }
    );
  }
}
