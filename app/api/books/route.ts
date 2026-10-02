import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { books } from '@/lib/db/schema'
import { and, asc, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm'

const PAGE_SIZE = 24

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)
  const query = params.get('q')?.trim() ?? ''
  const ids = params.get('ids')?.split(',').map((id) => id.trim()).filter(Boolean) ?? []
  const category = params.get('category')?.trim() ?? ''
  const sort = params.get('sort') ?? 'featured'
  const filters: SQL[] = [eq(books.isArchived, false)]
  if (ids.length) filters.push(sql`${books.id} in ${ids}`)
  if (query) {
    const searchFilter = or(ilike(books.title, `%${query}%`), ilike(books.author, `%${query}%`), ilike(books.category, `%${query}%`))
    if (searchFilter) filters.push(searchFilter)
  }
  if (category && category !== 'All books') filters.push(eq(books.category, category))
  const orderBy = sort === 'price-asc' ? asc(books.price) : sort === 'price-desc' ? desc(books.price) : sort === 'rating' ? desc(books.rating) : desc(books.createdAt)
  const rows = await db.select().from(books).where(filters.length ? and(...filters) : undefined).orderBy(orderBy).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE)
  return NextResponse.json({ books: rows, page, pageSize: PAGE_SIZE, hasMore: rows.length === PAGE_SIZE })
}
