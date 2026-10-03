import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { and, eq } from 'drizzle-orm'
import { StoreHeader } from '@/components/store-header'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orderItems, orders } from '@/lib/db/schema'

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const id = (await params).id
  const order = (await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.userId, session.user.id))).limit(1))[0]
  if (!order) notFound()
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))

  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-[#f8f5ee] px-4 py-8 text-[#183d38] sm:px-5 sm:py-12 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c26742]">Order placed successfully</p>
          <h1 className="mt-3 break-words font-serif text-4xl sm:text-5xl">Thank you, {order.customerName}.</h1>
          <p className="mt-4 break-words text-sm leading-6 text-[#59645f] sm:text-base">Order #{order.id} · {order.createdAt.toLocaleDateString('en-IN')} · {order.status}</p>
          <section className="mt-7 border border-[#dcd3c2] bg-white p-4 sm:mt-10 sm:p-6">
            <h2 className="font-serif text-2xl">Items</h2>
            <div className="mt-4 divide-y divide-[#eadfce]">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 py-4 sm:gap-4">
                  <div className="min-w-0">
                    <p className="break-words font-bold">{item.title}</p>
                    <p className="mt-1 text-sm leading-5 text-[#59645f]">{item.author} · Qty {item.quantity}</p>
                  </div>
                  <b className="shrink-0 whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</b>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-[#eadfce] pt-4 text-sm">
              <p className="flex justify-between gap-3"><span>Subtotal</span><b>₹{order.subtotal.toLocaleString('en-IN')}</b></p>
              <p className="mt-2 flex justify-between gap-3"><span>Shipping</span><b>₹{order.shipping.toLocaleString('en-IN')}</b></p>
              <p className="mt-3 flex justify-between gap-3 text-lg"><span>Total</span><b>₹{order.total.toLocaleString('en-IN')}</b></p>
            </div>
          </section>
          <section className="mt-5 border border-[#dcd3c2] bg-white p-4 sm:p-6">
            <h2 className="font-serif text-2xl">Delivery details</h2>
            <p className="mt-4 break-words leading-7 text-[#59645f]">{order.shippingAddress}</p>
          </section>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/account" className="bg-[#c26742] px-5 py-3 text-center font-bold text-white">My orders</Link>
            <Link href="/books" className="border border-[#183d38] px-5 py-3 text-center font-bold">Continue shopping</Link>
          </div>
        </div>
      </main>
    </>
  )
}
