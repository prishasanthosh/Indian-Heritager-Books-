'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart-provider'

export function StoreHeader() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6dfd1] bg-[#fbfaf6] px-5 py-5 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Indian Heritager Foundation" width="40" height="40" className="size-10 shrink-0 rounded-full object-contain" />
          <span>
            <strong className="block font-serif text-xl">Indian Heritager</strong>
            <small className="text-[9px] font-bold tracking-[0.25em] text-[#c26742]">BOOKS</small>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-3 text-sm font-semibold sm:gap-6">
          <Link href="/" className="hidden hover:text-[#c26742] sm:block">Home</Link>
          <Link href="/account" className="hidden hover:text-[#c26742] sm:block">My Orders</Link>
          <Link href="/account" className="rounded-full bg-[#f4c532] px-4 py-2">Account</Link>
          <Link
            href="/cart"
            aria-label={`${count} ${count === 1 ? 'item' : 'items'} in cart`}
            className="relative grid size-10 place-items-center rounded-full hover:bg-[#f4c532]/20"
          >
            <ShoppingBag size={20} aria-hidden="true" />
            <span aria-hidden="true" className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#c26742] px-1 text-[11px] font-bold leading-none text-white">
              {count > 99 ? '99+' : count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
