'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { bookCategories, getCategoryBySlug, booksHref } from '@/lib/categories'
import { StoreHeader } from '@/components/store-header'
import { useCart } from '@/components/cart-provider'

type Book = { id: string; title: string; author: string; category: string; price: number; originalPrice?: number | null; cover: string; badge?: string | null; rating: string | number; stock: number }
type ApiResponse = { books: Book[]; page: number; pageSize: number; hasMore: boolean }

const sortOptions = [{ label: 'Relevance', value: 'featured' }, { label: 'Newest', value: 'newest' }, { label: 'Price: low to high', value: 'price-asc' }, { label: 'Price: high to low', value: 'price-desc' }, { label: 'Rating', value: 'rating' }]
const bookHref = (title: string, id: string) => `/books/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id}`

export default function BooksPage() {
  const { add, items } = useCart()
  const [search, setSearch] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [language, setLanguage] = useState('')
  const [price, setPrice] = useState('')
  const [rating, setRating] = useState('')
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<ApiResponse>({ books: [], page: 1, pageSize: 24, hasMore: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearch(params.get('search') ?? params.get('q') ?? '')
    setCategorySlug(params.get('category') ?? '')
    setSort(params.get('sort') ?? 'featured')
    setPage(Math.max(1, Number(params.get('page') ?? '1') || 1))
  }, [])

  const category = useMemo(() => getCategoryBySlug(categorySlug), [categorySlug])
  const updateUrl = (next: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams()
    const values = { search, category: categorySlug, sort, page, ...next }
    if (values.search) params.set('search', values.search)
    if (values.category) params.set('category', values.category)
    if (values.sort && values.sort !== 'featured') params.set('sort', values.sort)
    if (values.page && values.page !== 1) params.set('page', String(values.page))
    window.history.pushState({}, '', `/books${params.toString() ? `?${params}` : ''}`)
  }

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ page: String(page), sort })
    if (search) params.set('q', search)
    if (category) params.set('category', category.value)
    setLoading(true)
    fetch(`/api/books?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: ApiResponse) => setResult(data))
      .catch((error) => { if (error.name !== 'AbortError') setResult({ books: [], page, pageSize: 24, hasMore: false }) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [page, search, category, sort])

  const change = (next: Record<string, string | number | boolean>) => {
    if ('search' in next) setPage(1)
    if ('category' in next) setCategorySlug(String(next.category))
    if ('sort' in next) setSort(String(next.sort))
    if ('search' in next) setSearch(String(next.search))
    if ('page' in next) setPage(Number(next.page))
    updateUrl({ page: 'search' in next || 'category' in next || 'sort' in next ? 1 : page, ...next })
  }

  const clearFilters = () => { setSearch(''); setCategorySlug(''); setLanguage(''); setPrice(''); setRating(''); setInStock(false); setSort('featured'); setPage(1); window.history.pushState({}, '', '/books') }
  const title = category?.name ?? 'All Books'

  return <main className="min-h-screen bg-[#f8f5ee] text-[#183d38]">
    <StoreHeader />
    <section className="mx-auto max-w-[1280px] px-5 py-12 lg:px-8 lg:py-16"><a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#c26742]"><ArrowLeft size={16}/> Back to home</a><div className="mt-8 flex flex-col justify-between gap-4 border-b border-[#dcd3c2] pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-bold tracking-[0.2em] text-[#c26742]">THE COLLECTION</p><h1 className="mt-2 font-serif text-5xl tracking-[-0.04em]">{title}</h1><p className="mt-3 text-sm text-[#6e7069]">{loading ? 'Finding books…' : `${result.books.length}${result.hasMore ? '+' : ''} books`}</p></div><select aria-label="Sort books" value={sort} onChange={(event) => change({ sort: event.target.value })} className="h-11 border border-[#dcd3c2] bg-[#fbfaf6] px-3 text-sm"><option value="featured">Relevance</option>{sortOptions.slice(1).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]"><aside className="space-y-5"><label className="block text-xs font-bold uppercase tracking-wider">Search<input value={search} onChange={(event) => change({ search: event.target.value })} placeholder="Title, author, ISBN" className="mt-2 h-11 w-full border border-[#dcd3c2] bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#c26742]" /></label><label className="block text-xs font-bold uppercase tracking-wider">Category<select value={categorySlug} onChange={(event) => change({ category: event.target.value })} className="mt-2 h-11 w-full border border-[#dcd3c2] bg-[#fbfaf6] px-3 text-sm"><option value="">All categories</option>{bookCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label><label className="block text-xs font-bold uppercase tracking-wider">Language<select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 h-11 w-full border border-[#dcd3c2] bg-[#fbfaf6] px-3 text-sm"><option value="">All languages</option><option>English</option><option>Hindi</option><option>Regional</option></select></label><label className="block text-xs font-bold uppercase tracking-wider">Price<select value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 h-11 w-full border border-[#dcd3c2] bg-[#fbfaf6] px-3 text-sm"><option value="">Any price</option><option value="under-500">Under ₹500</option><option value="500-1000">₹500 – ₹1,000</option><option value="over-1000">Over ₹1,000</option></select></label><label className="block text-xs font-bold uppercase tracking-wider">Rating<select value={rating} onChange={(event) => setRating(event.target.value)} className="mt-2 h-11 w-full border border-[#dcd3c2] bg-[#fbfaf6] px-3 text-sm"><option value="">Any rating</option><option value="4">4+ stars</option><option value="3">3+ stars</option></select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} className="accent-[#c26742]"/> In stock only</label><button onClick={clearFilters} className="text-sm font-bold text-[#c26742] underline underline-offset-4">Clear filters</button></aside>
        <div>{loading ? <p className="py-24 text-center font-serif text-2xl">Loading the collection…</p> : result.books.length === 0 ? <div className="border border-[#dcd3c2] bg-[#fbfaf6] px-6 py-24 text-center"><BookOpen className="mx-auto mb-5 text-[#c26742]" size={34}/><h2 className="font-serif text-3xl">{category ? 'No books in this category yet' : 'No books match your search'}</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6e7069]">Try another category or explore all books.</p><a href={booksHref()} className="mt-7 inline-flex bg-[#c26742] px-5 py-3 text-sm font-bold text-white">Show all books</a></div> : <><div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">{result.books.map((book) => { const quantityInCart = items.find((item) => item.id === book.id)?.quantity ?? 0; const atStockLimit = quantityInCart >= book.stock; return <article key={book.id}><Link href={bookHref(book.title, book.id)} aria-label={`View details for ${book.title}`} className="group block"><div className="aspect-[3/4] overflow-hidden bg-[#e8dfcf]">{book.cover ? <img src={book.cover} alt={`Cover of ${book.title}`} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"/> : <div className="flex size-full flex-col justify-between bg-[#e9dfc9] p-5"><BookOpen className="text-[#c26742]"/><span className="font-serif text-xl leading-tight">{book.title}</span></div>}</div><h2 className="mt-3 font-serif text-lg leading-tight group-hover:text-[#c26742]">{book.title}</h2><p className="mt-1 text-sm text-[#6e7069]">{book.author}</p><p className="mt-2 text-sm font-bold">₹{book.price.toLocaleString('en-IN')}</p><span className="mt-3 inline-block text-sm font-bold text-[#c26742] underline underline-offset-4">View book details</span></Link><button type="button" disabled={book.stock < 1 || atStockLimit} onClick={() => add(book.id, 1, book.stock)} className="mt-3 w-full bg-[#c26742] px-4 py-3 text-sm font-bold text-white hover:bg-[#a94f31] disabled:cursor-not-allowed disabled:bg-[#9b9b93]">{book.stock < 1 ? 'Out of stock' : atStockLimit ? 'Maximum in cart' : 'Add to cart'}</button></article> })}</div><div className="mt-12 flex justify-center gap-3"><button disabled={page === 1} onClick={() => change({ page: page - 1 })} className="border border-[#dcd3c2] px-4 py-2 disabled:opacity-40"><ChevronLeft size={18}/></button><span className="px-3 py-2 text-sm font-bold">Page {page}</span><button disabled={!result.hasMore} onClick={() => change({ page: page + 1 })} className="border border-[#dcd3c2] px-4 py-2 disabled:opacity-40"><ChevronRight size={18}/></button></div></>}</div></div></section>
  </main>
}
