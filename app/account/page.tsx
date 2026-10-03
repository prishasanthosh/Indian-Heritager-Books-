import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClipboardList, UserRound } from 'lucide-react'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { SignOutButton } from './sign-out-button'

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const orderHistory = await db.select().from(orders).where(eq(orders.userId, session.user.id)).orderBy(desc(orders.createdAt))

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#183d38]">
      <div className="bg-[#173d38] px-3 py-2 text-center text-[9px] font-semibold leading-relaxed tracking-[0.1em] text-[#f4c532] sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.12em]">INDIAN HERITAGER BOOKSHOP</div>
      <header className="border-b border-[#e6dfd1] bg-[#fbfaf6]"><div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-5 lg:px-8"><Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Back to Indian Heritager Books home"><img src="/logo.png" alt="Indian Heritager Foundation" width="40" height="40" className="size-10 shrink-0 rounded-full object-contain" /><span className="min-w-0 leading-tight"><strong className="block text-[13px] font-extrabold sm:text-lg">Indian Heritager</strong><small className="block text-[9px] sm:text-xs">Foundation - Books</small></span></Link><SignOutButton /></div></header>
      <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-5 sm:py-14 lg:px-8 lg:py-20"><p className="text-xs font-bold tracking-[0.2em] text-[#c26742]">YOUR ACCOUNT</p><h1 className="mt-3 break-words font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Welcome back, {session.user.name || 'reader'}.</h1><div className="mt-7 grid gap-4 md:mt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-5"><div className="min-w-0 border border-[#dcd3c2] bg-[#fbfaf6] p-5 sm:p-7"><div className="flex items-center gap-3"><UserRound className="shrink-0 text-[#c26742]" /><h2 className="font-serif text-2xl">Profile</h2></div><p className="mt-6 break-all text-sm text-[#59645f]">{session.user.email}</p><Link href="/#books" className="mt-6 inline-flex bg-[#c26742] px-5 py-3 text-sm font-bold text-white hover:bg-[#d07750]">Browse books</Link></div><div className="min-w-0 border border-[#dcd3c2] bg-[#fbfaf6] p-5 sm:p-7"><div className="flex items-center gap-3"><ClipboardList className="shrink-0 text-[#c26742]" /><h2 className="font-serif text-2xl">Order history</h2></div>{orderHistory.length === 0 ? <div className="py-8"><p className="text-sm leading-6 text-[#59645f]">You haven&apos;t placed any orders yet.</p><Link href="/#books" className="mt-5 inline-flex bg-[#c26742] px-5 py-3 text-sm font-bold text-white hover:bg-[#d07750]">Browse books</Link></div> : <div className="mt-6 divide-y divide-[#e6dfd1]">{orderHistory.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><Link href={`/orders/${order.id}`} className="font-bold text-[#c26742]">Order #{order.id.slice(0, 8)}</Link><p className="mt-1 text-xs text-[#59645f]">{order.createdAt.toLocaleDateString('en-IN')} · {order.status}</p></div><p className="font-bold">₹{order.total.toLocaleString('en-IN')}</p></div>)}</div>}</div></div></section>
    </main>
  )
}

export function generateMetadata() { return { title: 'My account | Indian Heritager Books', description: 'View your Indian Heritager Books profile and order history.' } }

// The button is kept in a client boundary so the page remains server-authorized.
