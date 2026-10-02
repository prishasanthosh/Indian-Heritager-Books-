import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { and, desc, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, statusValues } from '@/lib/db/schema'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean)
  return session?.user && admins.includes(session.user.email.toLowerCase()) ? session.user : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json(await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100))
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json() as { id?: unknown; status?: unknown }
  const id = typeof body.id === 'string' ? body.id : ''
  const status = typeof body.status === 'string' ? body.status : ''
  if (!id || !statusValues.includes(status as (typeof statusValues)[number])) return NextResponse.json({ error: 'Invalid order status.' }, { status: 400 })
  const [updated] = await db.update(orders).set({ status }).where(and(eq(orders.id, id))).returning()
  return updated ? NextResponse.json(updated) : NextResponse.json({ error: 'Order not found.' }, { status: 404 })
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json({ error: 'Orders are historical records and cannot be deleted.' }, { status: 405 })
}
