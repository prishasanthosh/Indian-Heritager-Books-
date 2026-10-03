import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/components/cart-provider'
import { StoreFooter } from '@/components/store-footer'

export const metadata: Metadata = {
  title: 'Indian Heritager Books | Discover stories. Preserve heritage.',
  description: 'Explore a thoughtfully curated collection of books celebrating knowledge, culture, history and stories from India and beyond.',
  generator: 'v0.app',
  keywords: ['Indian heritage', 'Indian books', 'culture', 'history', 'literature'],
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: [{ url: '/logo.png', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#173d38',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased">
        <CartProvider>
          {children}
          <StoreFooter />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
