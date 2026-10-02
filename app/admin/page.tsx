import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { books, orders } from '@/lib/db/schema'
import { CatalogueManager } from './catalogue-manager'
import { OrderManager } from './order-manager'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean)
  if (!admins.includes(session.user.email.toLowerCase())) redirect('/')
  const [catalogue, recentOrders] = await Promise.all([
    db.select().from(books).orderBy(desc(books.createdAt)),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100),
  ])
  return <main className="min-h-screen bg-[#f8f5ee] p-6 text-[#183d38] md:p-12"><div className="mx-auto max-w-6xl space-y-8"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c26742]">Indian Heritager</p><h1 className="mt-2 font-serif text-4xl">Shop operations</h1><p className="mt-2 text-[#59645f]">Manage books, stock, and recorded orders securely.</p></div><Link href="/" className="font-bold text-[#c26742]">View shop →</Link></header><section className="grid gap-4 sm:grid-cols-3"><div className="bg-white p-5"><p className="text-sm text-[#59645f]">Books</p><p className="mt-2 text-3xl font-bold">{catalogue.length}</p></div><div className="bg-white p-5"><p className="text-sm text-[#59645f]">Recorded orders</p><p className="mt-2 text-3xl font-bold">{recentOrders.length}</p></div><div className="bg-white p-5"><p className="text-sm text-[#59645f]">Signed in as</p><p className="mt-2 truncate font-bold">{session.user.email}</p></div></section><CatalogueManager initialBooks={catalogue} /><OrderManager initialOrders={recentOrders} /></div></main>
}
