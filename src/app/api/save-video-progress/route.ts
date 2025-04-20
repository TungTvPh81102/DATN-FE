import { learningPathApi } from '@/services/learning-path/learning-path-api'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const payload = await req.json()

  const token = req.cookies.get('access_token')?.value

  try {
    await learningPathApi.updateLastTime(payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error: any) {
    return Response.json(
      {
        message: 'Máy chủ gặp sự cố, vui lòng thử lại sau',
        error: error.message,
      },
      { status: 500 }
    )
  }

  return new Response()
}
