'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, ChevronDown, Search, ShoppingBag, Star, UserRound, X } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { bookCategories } from '@/lib/categories'

type Book = {
  id: number
  title: string
  author: string
  category: string
  price: number
  originalPrice?: number
  cover: string
  badge?: string
  rating: number
}

const books: Book[] = []

const categories = ['All books', 'Indian Literature', 'History & Heritage', 'Culture & Heritage', "Children's Books", 'Nature & Environment']

export default function Page() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All books')
  const [sort, setSort] = useState('Featured')
  const [cart, setCart] = useState<Book[]>([])
  const [showCart, setShowCart] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const { data: session, isPending } = useSession()

  const announce = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3200)
  }

  const filteredBooks = useMemo(() => {
    const result = books.filter((book) => {
      const matchesCategory = category === 'All books' || book.category === category
      const matchesQuery = `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
    if (sort === 'Price: Low to High') return [...result].sort((a, b) => a.price - b.price)
    if (sort === 'Price: High to Low') return [...result].sort((a, b) => b.price - a.price)
    if (sort === 'Rating') return [...result].sort((a, b) => b.rating - a.rating)
    return result
  }, [category, query, sort])

  const addToCart = (book: Book) => setCart((current) => current.some((item) => item.id === book.id) ? current : [...current, book])

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#183d38]">
      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 bg-[#173d38] px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>}
      <div className="bg-[#173d38] px-5 py-2.5 text-center text-[11px] font-semibold tracking-[0.12em] text-[#f4c532] sm:text-xs">EVERY BOOK PURCHASE SUPPORTS INDIAN HERITAGER FOUNDATION&apos;S COMMUNITY PROGRAMMES</div>
      <header className="sticky top-0 z-20 border-b border-[#e6dfd1] bg-[#fbfaf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center gap-5 px-5 py-4 lg:px-8">
          <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="Indian Heritager Books home">
            <img src="/logo.png" alt="Indian Heritager Foundation" width="52" height="52" className="size-12 shrink-0 object-contain" />
            <span className="hidden leading-none sm:block"><strong className="block font-sans text-[17px] font-extrabold tracking-tight">Indian Heritager</strong><small className="mt-1 block text-[9px] font-bold tracking-[0.25em] text-[#c26742]">BOOKS</small></span>
          </a>
          <nav className={`${mobileMenu ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-4 border-b border-[#e6dfd1] bg-[#fbfaf6] px-5 py-5 text-sm font-semibold lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0`}>
            <a href="#books" className="text-[#c26742]">Books</a><a href="#categories" className="hover:text-[#c26742]">Categories</a><a href="#story" className="hover:text-[#c26742]">Our story</a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <label className="hidden h-11 w-[300px] items-center gap-2 border border-[#dcd3c2] bg-[#f5f0e6] px-3 text-[#6e7069] md:flex"><Search size={17}/><span className="sr-only">Search books</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books, authors…" className="w-full bg-transparent text-sm outline-none placeholder:text-[#888a82]" /></label>
            <button onClick={() => setShowCart(true)} className="relative rounded-full p-2 hover:bg-[#f1eadb]" aria-label={`Cart, ${cart.length} books`}><ShoppingBag size={21}/>{cart.length > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#c26742] text-[10px] text-white">{cart.length}</span>}</button>
            {!isPending && (session?.user ? <a href="/account" className="hidden items-center gap-2 rounded-full bg-[#f4c532] px-4 py-2.5 text-sm font-bold text-[#183d38] transition hover:bg-[#ffd75c] sm:inline-flex"><UserRound size={16} /> My account</a> : <a href="/sign-in" className="hidden rounded-full bg-[#f4c532] px-5 py-2.5 text-sm font-bold text-[#183d38] transition hover:bg-[#ffd75c] sm:block">Sign in</a>)}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 lg:hidden" aria-label="Toggle menu"><span className="block h-0.5 w-5 bg-[#183d38]"/><span className="mt-1.5 block h-0.5 w-5 bg-[#183d38]"/></button>
          </div>
        </div>
      </header>

      <section id="top" className="relative flex min-h-[560px] items-center overflow-hidden bg-[#173d38] px-5 py-16 text-[#fbfaf6] sm:min-h-[620px] lg:min-h-[660px] lg:px-8">
        <img src="/hero-education.jpg" alt="A teacher sharing a book with children" className="absolute inset-0 size-full object-cover object-[58%_48%]" />
        <div className="absolute inset-0 bg-[#10251f]/55" />
        <div className="relative mx-auto w-full max-w-[1280px]">
          <p className="mb-5 text-xs font-bold tracking-[0.24em] text-[#f4c532]">THE INDIAN HERITAGER BOOKSHOP</p>
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.96] sm:text-7xl lg:text-[88px]">Discover stories.<br/><em className="text-[#f4c532]">Preserve heritage.</em></h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-[#f3f1e9] sm:text-lg">A thoughtfully curated collection of books celebrating knowledge, culture, history and stories from India and beyond.</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href="#books" className="inline-flex items-center gap-3 bg-[#c26742] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#d07750]">Browse books <ArrowRight size={17}/></a><a href="#story" className="border border-white/70 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10">Our story</a></div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-24"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#c26742]">EXPLORE</p><h2 className="font-serif text-4xl tracking-[-0.03em] sm:text-5xl">Books for every curious mind</h2></div><a href="#books" className="text-sm font-bold text-[#c26742]">VIEW ALL BOOKS <ArrowRight className="ml-1 inline" size={16}/></a></div><div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{bookCategories.map((item, i) => <a key={item.slug} href={`/books?category=${item.slug}`} className="group min-h-36 bg-[#e9dfc9] p-5 text-left transition hover:-translate-y-1 hover:bg-[#d9c9a8] focus:outline-none focus:ring-2 focus:ring-[#c26742] sm:min-h-44"><span className="text-3xl text-[#c26742]">{String(i + 1).padStart(2, '0')}</span><strong className="mt-8 block max-w-[150px] font-serif text-xl leading-tight">{item.name}</strong><span className="mt-3 block text-[10px] font-bold tracking-[0.14em] opacity-60 group-hover:text-[#c26742]">EXPLORE →</span></a>)}</div></section>

      <section id="books" className="border-y border-[#e6dfd1] bg-[#fbfaf6] px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-[1280px]"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#c26742]">THE COLLECTION</p><h2 className="font-serif text-4xl tracking-[-0.03em] sm:text-5xl">Featured books</h2></div><div className="flex flex-col gap-3 sm:flex-row"><label className="flex h-11 items-center gap-2 border border-[#dcd3c2] bg-[#f5f0e6] px-3 text-[#6e7069] md:hidden"><Search size={17}/><span className="sr-only">Search books</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books…" className="w-full bg-transparent text-sm outline-none" /></label><select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 border border-[#dcd3c2] bg-[#f5f0e6] px-3 text-sm outline-none">{categories.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Sort books" value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 border border-[#dcd3c2] bg-[#f5f0e6] px-3 text-sm outline-none"><option>Featured</option><option>Newest</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Rating</option></select></div></div><div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{filteredBooks.map((book) => <article key={book.id} className="group"><div className="relative aspect-[3/4] overflow-hidden bg-[#e8dfcf]"><img src={book.cover} alt={`Cover of ${book.title}`} loading="lazy" width="700" height="930" className="size-full object-cover transition duration-500 group-hover:scale-105"/>{book.badge && <span className="absolute left-3 top-3 bg-[#f4c532] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#173d38]">{book.badge}</span>}<button onClick={() => addToCart(book)} className="absolute bottom-3 left-3 right-3 translate-y-2 bg-[#c26742] py-3 text-xs font-bold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">ADD TO CART</button></div><div className="pt-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#c26742]">{book.category}</p><h3 className="mt-1 font-serif text-xl leading-tight">{book.title}</h3><p className="mt-1 text-sm text-[#6e7069]">{book.author}</p><div className="mt-3 flex items-center justify-between"><span className="font-bold">₹{book.price.toLocaleString('en-IN')}</span><span className="flex items-center gap-1 text-xs text-[#8b7350]"><Star size={13} fill="currentColor"/> {book.rating}</span></div></div></article>)}</div>{filteredBooks.length === 0 && <div className="py-20 text-center"><BookOpen className="mx-auto mb-4 text-[#c26742]"/><p className="font-serif text-2xl">No books found</p><p className="mt-2 text-sm text-[#6e7069]">Try a different search or category.</p></div>}<div className="mt-14 text-center"><button className="border border-[#c26742] px-6 py-3 text-sm font-bold text-[#c26742] hover:bg-[#c26742] hover:text-white">LOAD MORE BOOKS</button><p className="mt-3 text-xs text-[#85867d]">Showing {filteredBooks.length} of 500+ books · fast, paginated catalogue</p></div></div></section>

      <section id="story" className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8 lg:py-24"><div className="aspect-[4/3] bg-[#d9c9a8] p-8 sm:p-14"><div className="flex h-full flex-col justify-between border border-[#183d38]/30 p-6 sm:p-9"><BookOpen size={34} strokeWidth={1.2}/><p className="max-w-sm font-serif text-3xl leading-tight sm:text-4xl">Books open doors to worlds we have never seen.</p><span className="text-xs font-bold tracking-[0.15em] text-[#c26742]">INDIAN HERITAGER FOUNDATION</span></div></div><div><p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#c26742]">WHY SHOP WITH US</p><h2 className="max-w-xl font-serif text-4xl tracking-[-0.03em] sm:text-5xl">Every book carries a story forward.</h2><p className="mt-6 max-w-lg leading-7 text-[#59645f]">Indian Heritager Foundation connects available resources with communities that need them most. Your purchase helps us build stronger communities through education, environment and social development.</p><div className="mt-8 grid max-w-lg grid-cols-2 gap-5 border-t border-[#dcd3c2] pt-5"><div><strong className="font-serif text-3xl">500+</strong><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#6e7069]">Books to discover</p></div><div><strong className="font-serif text-3xl">100%</strong><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#6e7069]">Purpose-led</p></div></div></div></section>

      <footer className="bg-[#173d38] px-5 py-12 text-[#e7eee7] lg:px-8"><div className="mx-auto flex max-w-[1280px] flex-col gap-10 sm:flex-row sm:justify-between"><div><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#f4c532] text-[#173d38]"><BookOpen size={19}/></span><strong className="font-serif text-xl">Indian Heritager Books</strong></div><p className="mt-4 max-w-xs text-sm leading-6 text-[#b7c9bd]">A books-only shop from Indian Heritager Foundation, celebrating knowledge, culture and heritage.</p></div><div className="grid grid-cols-2 gap-12 text-sm"><div><p className="mb-4 text-xs font-bold tracking-widest text-[#f4c532]">SHOP</p><a className="block py-1 text-[#b7c9bd] hover:text-white" href="#books">All books</a><a className="block py-1 text-[#b7c9bd] hover:text-white" href="#categories">Categories</a></div><div><p className="mb-4 text-xs font-bold tracking-widest text-[#f4c532]">FOUNDATION</p><a className="block py-1 text-[#b7c9bd] hover:text-white" href="#story">Our story</a><a className="block py-1 text-[#b7c9bd] hover:text-white" href="https://www.indianheritager.org/">Main website</a></div></div></div><div className="mx-auto mt-10 max-w-[1280px] border-t border-[#3e6259] pt-5 text-xs text-[#91aa9e]">© 2026 Indian Heritager Foundation. All rights reserved.</div></footer>

      {showCart && <div className="fixed inset-0 z-30 bg-[#173d38]/40" onClick={() => setShowCart(false)}><aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[#fbfaf6] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="font-serif text-3xl">Your cart</h2><button onClick={() => setShowCart(false)} aria-label="Close cart"><X/></button></div>{cart.length === 0 ? <div className="py-24 text-center"><ShoppingBag className="mx-auto mb-4 text-[#c26742]"/><p className="font-serif text-xl">Your cart is empty</p><p className="mt-2 text-sm text-[#6e7069]">Add a book to begin your order.</p></div> : <><div className="mt-8 space-y-4">{cart.map((book) => <div key={book.id} className="flex gap-3 border-b border-[#e6dfd1] pb-4"><img src={book.cover} alt="" className="size-16 object-cover"/><div className="flex-1"><p className="font-serif text-lg leading-tight">{book.title}</p><p className="mt-1 text-sm">₹{book.price.toLocaleString('en-IN')}</p></div><button onClick={() => setCart(cart.filter((item) => item.id !== book.id))} className="self-start text-xs text-[#c26742]">Remove</button></div>)}</div><div className="mt-8 border-t border-[#dcd3c2] pt-5"><div className="flex justify-between font-bold"><span>Subtotal</span><span>₹{cart.reduce((sum, book) => sum + book.price, 0).toLocaleString('en-IN')}</span></div><button onClick={() => announce('Checkout is ready to connect to your payment provider.')} className="mt-5 w-full bg-[#c26742] py-3.5 text-sm font-bold text-white transition hover:bg-[#d07750]">PROCEED TO CHECKOUT</button></div></>}</aside></div>}
    </main>
  )
}
