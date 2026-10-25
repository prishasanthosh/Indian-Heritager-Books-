export type BookCategory = {
  name: string
  slug: string
  value: string
}

export const bookCategories: BookCategory[] = [
  { name: 'Computer Science and IT', slug: 'computer-science-it', value: 'Computer Science and IT' },
  { name: 'Business and Management', slug: 'business-management', value: 'Business and Management' },
  { name: 'Finance, Banking and Investment', slug: 'finance-banking-investment', value: 'Finance, Banking and Investment' },
  { name: 'Economics', slug: 'economics', value: 'Economics' },
  { name: 'Marketing and Consumer Studies', slug: 'marketing-consumer-studies', value: 'Marketing and Consumer Studies' },
  { name: 'Medical Science and Healthcare', slug: 'medical-science-healthcare', value: 'Medical Science and Healthcare' },
  { name: 'Engineering and Applied Sciences', slug: 'engineering-applied-sciences', value: 'Engineering and Applied Sciences' },
  { name: 'Mathematics, Statistics and Aptitude', slug: 'mathematics-statistics-aptitude', value: 'Mathematics, Statistics and Aptitude' },
  { name: 'Aviation, Navigation and Meteorology', slug: 'aviation-navigation-meteorology', value: 'Aviation, Navigation and Meteorology' },
  { name: 'Language, Communication and Competitive Exams', slug: 'language-communication-competitive-exams', value: 'Language, Communication and Competitive Exams' },
  { name: 'Literature, Fiction and General Reading', slug: 'literature-fiction-general-reading', value: 'Literature, Fiction and General Reading' },
  { name: 'Human Resources and Organizational Studies', slug: 'human-resources-organizational-studies', value: 'Human Resources and Organizational Studies' },
  { name: 'Strategy, Research and Decision Sciences', slug: 'strategy-research-decision-sciences', value: 'Strategy, Research and Decision Sciences' },
]

export function getCategoryBySlug(slug: string | null) {
  return bookCategories.find((category) => category.slug === slug)
}

export function booksHref(slug?: string) {
  return slug ? `/books?category=${encodeURIComponent(slug)}` : '/books'
}
