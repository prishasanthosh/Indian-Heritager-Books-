import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { books, idFromBookSlug } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { StoreHeader } from '@/components/store-header'
import { AddToCart } from './add-to-cart'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const book = await db.select({ title: books.title, description: books.description }).from(books).where(eq(books.id, idFromBookSlug((await params).slug))).limit(1); return book[0] ? { title: `${book[0].title} | Indian Heritager`, description: book[0].description } : { title: 'Book | Indian Heritager' } }
export default async function BookDetail({ params }: { params: Promise<{ slug: string }> }) {
  const book = (await db.select().from(books).where(eq(books.id, idFromBookSlug((await params).slug))).limit(1))[0]
  if (!book || book.isArchived) notFound()

  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-[#f8f5ee] px-4 py-8 text-[#183d38] sm:px-5 sm:py-10 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/books" className="text-sm font-bold text-[#c26742]">← Back to catalogue</Link>
          <div className="mt-7 grid min-w-0 gap-7 sm:mt-10 sm:gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex min-h-[280px] items-center justify-center overflow-hidden border border-[#dcd3c2] bg-[#eadfce] p-4 text-center sm:min-h-[420px] sm:p-5">
              {book.cover
                ? <img src={book.cover} alt={`Cover of ${book.title}`} className="max-h-[620px] w-full object-contain" />
                : <span className="break-words font-serif text-3xl font-bold text-[#183d38] sm:text-4xl">{book.title}</span>}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c26742]">{book.category}</p>
              <h1 className="mt-3 break-words font-serif text-4xl leading-[0.98] sm:text-5xl">{book.title}</h1>
              <p className="mt-4 text-lg text-[#59645f]">by {book.author}</p>
              <p className="mt-8 leading-7 text-[#59645f]">{book.description || 'A thoughtful addition to your reading shelf.'}</p>
              <div className="mt-8 flex items-end gap-3">
                <span className="text-3xl font-bold">₹{book.price.toLocaleString('en-IN')}</span>
                {book.originalPrice && <span className="text-sm text-[#59645f] line-through">₹{book.originalPrice.toLocaleString('en-IN')}</span>}
              </div>
              <p className="mt-3 text-sm">{book.stock > 0 ? `${book.stock} available` : 'Out of Stock'}</p>
              <AddToCart id={book.id} stock={book.stock} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
