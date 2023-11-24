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
        lesson.lessonHour === lessonHour && lesson.dayOfWeek === dayOfWeek
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

    console.log(groupId);

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
