export type BookCategory = {
  name: string
  slug: string
  value: string
}

export const bookCategories: BookCategory[] = [
  { name: 'Indian Literature', slug: 'indian-literature', value: 'Indian Literature' },
  { name: 'History', slug: 'history', value: 'History' },
  { name: 'Culture & Heritage', slug: 'culture-heritage', value: 'Culture & Heritage' },
  { name: "Children's Books", slug: 'childrens-books', value: "Children's Books" },
  { name: 'Education', slug: 'education', value: 'Education' },
  { name: 'Fiction', slug: 'fiction', value: 'Fiction' },
  { name: 'Non-Fiction', slug: 'non-fiction', value: 'Non-Fiction' },
  { name: 'Biography', slug: 'biography', value: 'Biography' },
  { name: 'Regional Literature', slug: 'regional-literature', value: 'Regional Literature' },
  { name: 'Academic / Learning', slug: 'academic-learning', value: 'Academic / Learning' },
]

export function getCategoryBySlug(slug: string | null) {
  return bookCategories.find((category) => category.slug === slug)
}

export function booksHref(slug?: string) {
  return slug ? `/books?category=${encodeURIComponent(slug)}` : '/books'
}
