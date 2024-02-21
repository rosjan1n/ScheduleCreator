import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessonValidator } from "@/lib/validators/basic";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      lessonHour,
      dayOfWeek,
      roomId,
      teacherId,
      subjectId,
      classId,
      groupId,
    } = lessonValidator.parse(body);

    const expectationsClass = await db.class.findUnique({
      where: { id: classId },
    });

    if (!expectationsClass) {
      return new Response(JSON.stringify({ error: "ClassNotFound" }), {
        status: 404,
      });
    }

    // get all lessons for this class
    const classLessons = await db.lesson.findMany({
      where: { classId },
    });

    // check if there is no lesson at this time
    const classLessonExists = classLessons.some(
      (lesson) =>
        lesson.lessonHour === lessonHour &&
        lesson.dayOfWeek === dayOfWeek &&
        lesson.groupId === groupId
    );
    if (classLessonExists) {
      return new Response(
        JSON.stringify({ error: "ClassHaveLessonAtThisTime" }),
        { status: 409 }
      );
    }

    // check if students will fit in the room
    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return new Response(JSON.stringify({ error: "RoomNotFound" }), {
        status: 404,
      });
    }
    if (room.capacity < expectationsClass.amountOfStudents) {
      return new Response(
        JSON.stringify({ error: "RoomIsTooSmallForThisClass" }),
        { status: 409 }
      );
    }

    // get all lessons
    const lessons = await db.lesson.findMany();

    // check if there is no lesson at this time in this room
    const lessonInRoomExists = lessons.some(
      (lesson) =>
        lesson.lessonHour === lessonHour &&
        lesson.dayOfWeek === dayOfWeek &&
        lesson.roomId === roomId
    );
    if (lessonInRoomExists) {
      return new Response(
        JSON.stringify({ error: "LessonInRoomAlreadyExists" }),
        { status: 409 }
      );
    }

    // check if there is no lesson at this time with this teacher
    const lessonWithTeacherExists = lessons.some(
      (lesson) =>
        lesson.lessonHour === lessonHour &&
        lesson.dayOfWeek === dayOfWeek &&
        lesson.teacherId === teacherId
    );
    if (lessonWithTeacherExists) {
      return new Response(
        JSON.stringify({ error: "LessonWithTeacherAlreadyExists" }),
        { status: 409 }
      );
    }

    // create lesson
    await db.lesson.create({
      data: {
        lessonHour,
        dayOfWeek,
        roomId,
        teacherId,
        subjectId,
        classId,
        groupId: groupId === "undefined" ? undefined : groupId,
      },
    });

    return new Response("Utworzono lekcję.");
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

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      lessonHour,
      dayOfWeek,
      roomId,
      teacherId,
      subjectId,
      classId,
      groupId,
    } = lessonValidator.parse(body);

    const lesson = await db.lesson.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!lesson)
      return new Response(JSON.stringify({ error: "LessonNotFound" }), {
        status: 404,
      });

    if (
      lesson.classId === classId &&
      lesson.dayOfWeek === dayOfWeek &&
      ((lesson.groupId === null && groupId === "undefined") ||
        lesson.groupId === groupId) &&
      lesson.lessonHour === lessonHour &&
      lesson.roomId === roomId &&
      lesson.subjectId === subjectId &&
      lesson.teacherId === teacherId
    )
      return new Response(JSON.stringify({ error: "NoChangesDetected" }), {
        status: 400,
      });

    // check if room is already taken
    const takenRoom = await db.lesson.findFirst({
      where: {
        dayOfWeek,
        lessonHour,
        roomId,
      },
    });

    if (takenRoom && takenRoom.id !== body.id) {
      return new Response(JSON.stringify({ error: "RoomAlreadyTaken" }), {
        status: 409,
      });
    }

    // edit lesson
    await db.lesson.update({
      where: {
        id: body.id,
      },
      data: {
        lessonHour,
        dayOfWeek,
        roomId,
        teacherId,
        subjectId,
        classId,
        groupId,
      },
    });

    return new Response("Pomyślnie edytowano lekcje.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response(
      "Wystąpił błąd podczas edycji lekcji. Spróbuj ponownie później.",
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // check if lesson exists
    const lessonToDelete = await db.lesson.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!lessonToDelete) {
      return new Response(JSON.stringify({ error: "LessonNotFound" }), {
        status: 404,
      });
    }

    // delete lesson
    await db.lesson.delete({
      where: {
        id: body.id,
      },
    });

    return new Response("Pomyślnie usunięto lekcję.");
  } catch {
    return new Response(
      "Wystąpił błąd podczas usuwania lekcji. Spróbuj ponownie później.",
      {
        status: 500,
      }
    );
  }
}
