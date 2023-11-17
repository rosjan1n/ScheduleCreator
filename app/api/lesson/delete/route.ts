import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { LessonDeleteValidator } from '@/lib/validators/delete'
import { z } from 'zod'

export async function POST(req: Request) {
  try {    
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { lessonId } = LessonDeleteValidator.parse(body)

    // create lesson
    await db.lesson.delete({
      where: {
        id: lessonId
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Nie można usunąć lekcji. Spróbuj ponownie później.',
      { status: 500 }
    )
  }
}