import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean)
  if (!session?.user || !admins.includes(session.user.email.toLowerCase())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Image storage is not configured. Contact the site administrator.' }, { status: 503 })
  }

  const formData = await request.formData()
  const file = formData.get('image')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 })
  }
  if (!allowedImageTypes.has(file.type)) {
    return NextResponse.json({ error: 'Use a JPEG, PNG, or WebP image.' }, { status: 400 })
  }
  if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: 'The image must be smaller than 5 MB.' }, { status: 400 })
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = 'indian-heritager/books'
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = createHash('sha1').update(signatureBase).digest('hex')
  const uploadData = new FormData()
  uploadData.append('file', file)
  uploadData.append('api_key', apiKey)
  uploadData.append('timestamp', timestamp)
  uploadData.append('folder', folder)
  uploadData.append('signature', signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: 'POST',
    body: uploadData,
    signal: AbortSignal.timeout(30_000),
  })
  const data: unknown = await response.json()
  if (!response.ok) {
    console.error('Cloudinary book cover upload failed', { status: response.status, data })
    return NextResponse.json({ error: 'The image could not be saved. Please try again.' }, { status: 502 })
  }
  if (typeof data !== 'object' || data === null || !('secure_url' in data) || typeof data.secure_url !== 'string') {
    console.error('Cloudinary book cover upload returned an invalid response')
    return NextResponse.json({ error: 'Image storage returned an invalid response.' }, { status: 502 })
  }

  return NextResponse.json({ url: data.secure_url })
}
