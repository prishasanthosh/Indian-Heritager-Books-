'use client'

import { useState } from 'react'

type Book = { id: string; title: string; author: string; category: string; description: string; price: number; originalPrice: number | null; cover: string; badge: string | null; stock: number; isArchived: boolean }
const empty = { title: '', author: '', category: 'Indian Literature', description: '', price: '', originalPrice: '', cover: '', badge: '', stock: '0', isArchived: false }

export function CatalogueManager({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState(initialBooks)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))

  async function save(event: React.FormEvent) {
    event.preventDefault(); setMessage('Saving…')
    const response = await fetch('/api/admin/books', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editing, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, stock: Number(form.stock), isArchived: form.isArchived }) })
    const data = await response.json()
    if (!response.ok) return setMessage(data.error ?? 'Could not save book.')
    setBooks((current) => editing ? current.map((book) => book.id === data.id ? data : book) : [data, ...current])
    setForm(empty); setEditing(null); setMessage('Book saved.')
  }

  function edit(book: Book) { setEditing(book.id); setForm({ title: book.title, author: book.author, category: book.category, description: book.description, price: String(book.price), originalPrice: book.originalPrice ? String(book.originalPrice) : '', cover: book.cover, badge: book.badge ?? '', stock: String(book.stock), isArchived: book.isArchived }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  async function remove(id: string) { if (!window.confirm('Delete this book from the catalogue?')) return; const response = await fetch(`/api/admin/books?id=${id}`, { method: 'DELETE' }); if (response.ok) setBooks((current) => current.filter((book) => book.id !== id)); else setMessage('Could not delete book.') }
  const fields = [['title', 'Title'], ['author', 'Author'], ['category', 'Category'], ['price', 'Price (₹)'], ['originalPrice', 'Original price (₹)'], ['stock', 'Stock'], ['badge', 'Badge'], ['cover', 'Cover text']] as const

  return <div className="space-y-8">
    <form onSubmit={save} className="border border-[#dfd2be] bg-[#fffdf8] p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c26742]">Catalogue editor</p><h2 className="mt-1 font-serif text-2xl text-[#183d38]">{editing ? 'Edit book' : 'Add a book'}</h2></div>{editing && <button type="button" onClick={() => { setEditing(null); setForm(empty) }} className="text-sm font-bold text-[#c26742]">Cancel edit</button>}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{fields.map(([key, label]) => <label key={key} className="text-sm font-semibold text-[#183d38]">{label}<input required={['title', 'author', 'category', 'price'].includes(key)} value={form[key]} onChange={(event) => update(key, event.target.value)} className="mt-1 w-full border border-[#d8cbb7] bg-white px-3 py-2 font-normal outline-none focus:border-[#c26742]" /></label>)}</div>
      <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-[#183d38]"><input type="checkbox" checked={form.isArchived} onChange={(event) => setForm((current) => ({ ...current, isArchived: event.target.checked }))} /> Archive this book (hide from shoppers)</label><label className="mt-4 block text-sm font-semibold text-[#183d38]">Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows={3} className="mt-1 w-full border border-[#d8cbb7] bg-white px-3 py-2 font-normal outline-none focus:border-[#c26742]" /></label>
      <div className="mt-5 flex flex-wrap items-center gap-4"><button className="bg-[#c26742] px-5 py-3 text-sm font-bold text-white hover:bg-[#a94f30]">{editing ? 'Update book' : 'Add book'}</button>{message && <span className="text-sm text-[#59645f]">{message}</span>}</div>
    </form>
    <section className="overflow-hidden border border-[#dfd2be] bg-white"><div className="border-b border-[#eadfce] p-5"><h2 className="font-serif text-2xl text-[#183d38]">Your books <span className="text-base font-sans text-[#59645f]">({books.length})</span></h2></div>{books.length === 0 ? <p className="p-6 text-[#59645f]">No books yet. Use the editor above to add your first title.</p> : <div className="divide-y divide-[#eadfce]">{books.map((book) => <div key={book.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div className="min-w-0"><p className="font-serif text-xl text-[#183d38]">{book.title}</p><p className="text-sm text-[#59645f]">{book.author} · {book.category} · ₹{book.price} · {book.stock} in stock {book.isArchived && <span className="font-bold text-[#a94f30]">· Archived</span>}</p></div><div className="flex gap-2"><button onClick={() => edit(book)} className="border border-[#c26742] px-4 py-2 text-sm font-bold text-[#a94f30]">Edit</button><button onClick={() => remove(book.id)} className="border border-[#b84c43] px-4 py-2 text-sm font-bold text-[#b84c43]">Delete</button></div></div>)}</div>}</section>
  </div>
}
