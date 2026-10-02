import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { books } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function isAdmin(email?: string | null) {
  return Boolean(email && (process.env.ADMIN_EMAILS ?? '').split(',').map((value) => value.trim().toLowerCase()).includes(email.toLowerCase()))
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdmin(session.user.email)) return null
  return session.user
}

function parseBook(body: Record<string, unknown>) {
  const title = String(body.title ?? '').trim()
  const author = String(body.author ?? '').trim()
  const category = String(body.category ?? '').trim()
  const price = Number(body.price)
  const stock = Number(body.stock ?? 0)
  if (!title || !author || !category || !Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return null
  return { title, author, category, price, stock, description: String(body.description ?? '').trim(), cover: String(body.cover ?? '').trim(), badge: String(body.badge ?? '').trim() || null, originalPrice: body.originalPrice ? Number(body.originalPrice) : null, isArchived: Boolean(body.isArchived) }
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const book = parseBook(await request.json())
  if (!book) return NextResponse.json({ error: 'Title, author, category, price and stock are required.' }, { status: 400 })
  const [created] = await db.insert(books).values({ id: crypto.randomUUID(), ...book }).returning()
  return NextResponse.json(created, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  const id = String(body.id ?? '')
  const book = parseBook(body)
  if (!id || !book) return NextResponse.json({ error: 'Invalid book details.' }, { status: 400 })
  const [updated] = await db.update(books).set({ ...book, updatedAt: new Date() }).where(eq(books.id, id)).returning()
  return updated ? NextResponse.json(updated) : NextResponse.json({ error: 'Book not found.' }, { status: 404 })
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Book id is required.' }, { status: 400 })
  await db.delete(books).where(eq(books.id, id))
  return NextResponse.json({ ok: true })
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json(await db.select().from(books))
}
