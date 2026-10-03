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
    <>
    <div className="bg-[#173d38] px-3 py-2 text-center text-[9px] font-semibold leading-relaxed tracking-[0.1em] text-[#f4c532] sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.12em]">EVERY BOOK PURCHASE SUPPORTS INDIAN HERITAGER FOUNDATION&apos;S COMMUNITY PROGRAMMES</div>
    <header className="sticky top-0 z-50 border-b border-[#e9e4d9] bg-[#fbfaf6] px-2 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-1 py-3 sm:gap-5 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <img src="/logo.png" alt="Indian Heritager Foundation" width="48" height="48" className="size-10 shrink-0 rounded-full object-contain sm:size-12" />
          <span className="leading-none">
            <strong className="block whitespace-nowrap font-sans text-[15px] font-bold text-[#183d38]">Indian Heritager</strong>
            <small className="mt-1 block whitespace-nowrap font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[#6e7069]">Foundation - Books</small>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-medium text-[#35434d] xl:flex">
          <Link href="/" className="border-b-2 border-[#f4bb20] py-2">Home</Link>
          <Link href="/#categories" className="hover:text-[#a86f00]">Categories</Link>
          <a href="https://www.indianheritager.org/about" className="hover:text-[#a86f00]">About Us</a>
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-3">
          {searchOpen && (
            <form action="/books" className="hidden items-center gap-2 rounded-full border border-[#e5dfd3] bg-white px-3 py-2 xl:flex">
              <Search size={17} aria-hidden="true" />
              <input autoFocus name="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books…" aria-label="Search books" className="w-full bg-transparent text-sm outline-none placeholder:text-[#858b8e] sm:w-40" />
            </form>
          )}
          <button type="button" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false) }} aria-label={searchOpen ? 'Close book search' : 'Search books'} className="hidden size-10 place-items-center rounded-full hover:bg-[#f1eadb] xl:grid">
            <Search size={20} aria-hidden="true" />
          </button>
          {session?.user
            ? <>
                <Link href="/account" aria-label="My account" className="hidden items-center gap-2 rounded-full bg-[#f4bb20] px-4 py-2.5 text-sm font-semibold text-[#101e29] xl:inline-flex"><UserRound size={16} /> My account</Link>
              </>
            : <>
                <Link href="/sign-in" aria-label="Sign in" className="hidden rounded-full bg-[#f4bb20] px-4 py-2.5 text-sm font-semibold text-[#101e29] xl:inline-flex">Sign in</Link>
              </>}
          <a href="https://www.indianheritager.org/give" target="_blank" rel="noopener noreferrer" className="hidden rounded-full bg-[#f4bb20] px-4 py-2.5 text-sm font-semibold text-[#101e29] transition hover:bg-[#ffd044] xl:inline-flex">Donate</a>
          <Link href="/cart" aria-label={`${count} ${count === 1 ? 'item' : 'items'} in cart`} className="relative grid size-9 place-items-center rounded-full hover:bg-[#f1eadb] sm:size-10">
            <ShoppingBag size={20} aria-hidden="true" />
            <span aria-hidden="true" className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#c26742] px-1 text-[11px] font-bold leading-none text-white">{count > 99 ? '99+' : count}</span>
          </Link>
          <button type="button" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }} aria-label={menuOpen ? 'Close menu' : 'Open menu'} className="grid size-9 place-items-center rounded-full hover:bg-[#f1eadb] sm:size-10 xl:hidden">
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && <div className="border-t border-[#e9e4d9] bg-[#fbfaf6] px-2 py-4 xl:hidden">
        <nav aria-label="Mobile navigation" className="flex flex-col gap-1 text-sm font-medium text-[#183d38]">
          <Link href="/" onClick={() => setMenuOpen(false)} className="rounded px-3 py-3 hover:bg-[#f1eadb]">Home</Link>
          <Link href="/#categories" onClick={() => setMenuOpen(false)} className="rounded px-3 py-3 hover:bg-[#f1eadb]">Categories</Link>
          <a href="https://www.indianheritager.org/about" onClick={() => setMenuOpen(false)} className="rounded px-3 py-3 hover:bg-[#f1eadb]">About Us</a>
          <a href="https://www.indianheritager.org/give" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="mt-1 rounded bg-[#f4bb20] px-3 py-3 font-semibold text-[#101e29] hover:bg-[#ffd044]">Donate</a>
        </nav>
        <form action="/books" className="mt-3 flex h-11 items-center gap-2 border border-[#dcd3c2] bg-white px-3">
          <Search size={18} aria-hidden="true" />
          <label className="sr-only" htmlFor="mobile-catalogue-search">Search books</label>
          <input id="mobile-catalogue-search" name="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books, authors…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          <button type="submit" aria-label="Submit book search" className="grid size-8 place-items-center"><Search size={17} /></button>
        </form>
        <Link href={session?.user ? '/account' : '/sign-in'} onClick={() => setMenuOpen(false)} className="mt-3 flex items-center gap-2 rounded bg-[#f4bb20] px-4 py-3 text-sm font-bold text-[#101e29]">
          <UserRound size={17} aria-hidden="true" /> {session?.user ? 'My account' : 'Sign in'}
        </Link>
      </div>}
    </header>
    </>
  )
}
