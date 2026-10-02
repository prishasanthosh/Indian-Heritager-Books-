import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { books } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await db.select({ id: books.id, title: books.title, author: books.author, category: books.category, description: books.description, price: books.price, originalPrice: books.originalPrice, cover: books.cover, badge: books.badge, rating: books.rating, stock: books.stock }).from(books).where(eq(books.id, id)).limit(1)
  if (!book[0]) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  return NextResponse.json({ book: book[0] })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body.stock !== 'number' || body.stock < 0 || !Number.isInteger(body.stock)) return NextResponse.json({ error: 'Invalid stock' }, { status: 400 })
  const updated = await db.update(books).set({ stock: body.stock, updatedAt: new Date() }).where(eq(books.id, id)).returning({ id: books.id, stock: books.stock })
  return updated[0] ? NextResponse.json({ book: updated[0] }) : NextResponse.json({ error: 'Book not found' }, { status: 404 })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updated = await db.update(books).set({ stock: 0, updatedAt: new Date() }).where(eq(books.id, id)).returning({ id: books.id })
  return updated[0] ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Book not found' }, { status: 404 })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return PATCH(request, { params })
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
