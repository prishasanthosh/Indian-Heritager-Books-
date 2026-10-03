'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { useSession } from '@/lib/auth-client'

export function StoreHeader() {
  const { count } = useCart()
  const { data: session } = useSession()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e4d9] bg-[#fbfaf6] px-5 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <img src="/logo.png" alt="Indian Heritager Foundation" width="58" height="58" className="size-14 shrink-0 rounded-full object-contain" />
          <span className="hidden sm:block">
            <strong className="block font-sans text-lg font-extrabold tracking-tight">Indian Heritager</strong>
            <small className="mt-1 block text-[10px] tracking-[0.23em] text-[#414b54]">FOUNDATION</small>
          </span>
        </Link>

        <nav aria-label="Main navigation" className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-4 border-b border-[#e9e4d9] bg-[#fbfaf6] px-5 py-5 text-sm font-medium text-[#35434d] xl:static xl:flex xl:flex-row xl:items-center xl:gap-7 xl:border-0 xl:bg-transparent xl:p-0`}>
          <Link href="/" className="border-b-2 border-[#f4bb20] py-2">Home</Link>
          <Link href="/#categories" className="hover:text-[#a86f00]">Categories</Link>
          <a href="https://www.indianheritager.org/about" className="hover:text-[#a86f00]">About Us</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {searchOpen && (
            <form action="/books" className="absolute left-4 right-4 top-full flex items-center gap-2 rounded-full border border-[#e5dfd3] bg-white px-3 py-2 sm:static sm:w-auto">
              <Search size={17} aria-hidden="true" />
              <input autoFocus name="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books…" aria-label="Search books" className="w-full bg-transparent text-sm outline-none placeholder:text-[#858b8e] sm:w-40" />
            </form>
          )}
          <button type="button" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false) }} aria-label={searchOpen ? 'Close book search' : 'Search books'} className="grid size-10 place-items-center rounded-full hover:bg-[#f1eadb]">
            <Search size={20} aria-hidden="true" />
          </button>
          {session?.user
            ? <>
                <Link href="/account" aria-label="My account" className="hidden items-center gap-2 rounded-full bg-[#f4bb20] px-4 py-2.5 text-sm font-semibold text-[#101e29] sm:inline-flex"><UserRound size={16} /> My account</Link>
                <Link href="/account" aria-label="My account" className="grid size-10 place-items-center rounded-full hover:bg-[#f1eadb] sm:hidden"><UserRound size={19} aria-hidden="true" /></Link>
              </>
            : <>
                <Link href="/sign-in" aria-label="Sign in" className="hidden rounded-full bg-[#f4bb20] px-4 py-2.5 text-sm font-semibold text-[#101e29] sm:inline-flex">Sign in</Link>
                <Link href="/sign-in" aria-label="Sign in" className="grid size-10 place-items-center rounded-full hover:bg-[#f1eadb] sm:hidden"><UserRound size={19} aria-hidden="true" /></Link>
              </>}
          <Link href="/cart" aria-label={`${count} ${count === 1 ? 'item' : 'items'} in cart`} className="relative grid size-10 place-items-center rounded-full hover:bg-[#f1eadb]">
            <ShoppingBag size={20} aria-hidden="true" />
            <span aria-hidden="true" className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#c26742] px-1 text-[11px] font-bold leading-none text-white">{count > 99 ? '99+' : count}</span>
          </Link>
          <button type="button" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }} aria-label={menuOpen ? 'Close menu' : 'Open menu'} className="grid size-10 place-items-center rounded-full hover:bg-[#f1eadb] xl:hidden">
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
