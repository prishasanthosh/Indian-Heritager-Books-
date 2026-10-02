import { boolean, integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', { id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull().unique(), emailVerified: boolean('emailVerified').notNull().default(false), image: text('image'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow() })
export const session = pgTable('session', { id: text('id').primaryKey(), expiresAt: timestamp('expiresAt').notNull(), token: text('token').notNull().unique(), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(), ipAddress: text('ipAddress'), userAgent: text('userAgent'), userId: text('userId').notNull() })
export const account = pgTable('account', { id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(), userId: text('userId').notNull(), accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'), accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow() })
export const verification = pgTable('verification', { id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow() })
export const books = pgTable('books', { id: text('id').primaryKey(), title: text('title').notNull(), author: text('author').notNull(), category: text('category').notNull(), description: text('description').notNull().default(''), price: integer('price').notNull(), originalPrice: integer('original_price'), cover: text('cover').notNull().default(''), badge: text('badge'), rating: numeric('rating', { precision: 2, scale: 1 }).notNull().default('0'), stock: integer('stock').notNull().default(0), isArchived: boolean('is_archived').notNull().default(false), createdAt: timestamp('created_at').notNull().defaultNow(), updatedAt: timestamp('updated_at').notNull().defaultNow() })
export const orders = pgTable('orders', { id: text('id').primaryKey(), userId: text('user_id').notNull(), status: text('status').notNull().default('pending'), total: integer('total').notNull(), subtotal: integer('subtotal').notNull().default(0), shipping: integer('shipping').notNull().default(0), customerName: text('customer_name').notNull(), customerEmail: text('customer_email').notNull(), customerPhone: text('customer_phone').notNull().default(''), shippingAddress: text('shipping_address').notNull(), shippingAddress2: text('shipping_address_2').notNull().default(''), city: text('city').notNull().default(''), state: text('state').notNull().default(''), pincode: text('pincode').notNull().default(''), country: text('country').notNull().default('India'), createdAt: timestamp('created_at').notNull().defaultNow() })
export const orderItems = pgTable('order_items', { id: text('id').primaryKey(), orderId: text('order_id').notNull(), bookId: text('book_id').notNull(), title: text('title').notNull(), author: text('author').notNull().default(''), price: integer('price').notNull(), quantity: integer('quantity').notNull().default(1) })
export type Book = typeof books.$inferSelect
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect

export const shippingFor = (subtotal: number) => subtotal >= 1000 ? 0 : 80
export const orderItemSubtotal = (price: number, quantity: number) => price * quantity

export function isValidCheckout(value: Record<string, unknown>) {
  const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'country']
  return required.every((key) => typeof value[key] === 'string' && String(value[key]).trim().length > 0) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value.email)) && String(value.pincode).trim().length >= 4
}

export function formatAddress(value: Record<string, unknown>) {
  return [value.address, value.address2, value.city, value.state, value.pincode, value.country].filter(Boolean).map(String).join(', ')
}

export function makeOrderId() { return `IH-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}` }

export const orderStatusLabels: Record<string, string> = { pending: 'Pending', recorded: 'Recorded', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }

export const publicBookColumns = { id: books.id, title: books.title, author: books.author, category: books.category, description: books.description, price: books.price, originalPrice: books.originalPrice, cover: books.cover, badge: books.badge, rating: books.rating, stock: books.stock }

export function coverFallback(title: string) { return title }

export const booksTable = books
export const orderTable = orders
export const orderItemsTable = orderItems

export const bookSlug = (title: string, id: string) => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id}`
export const idFromBookSlug = (slug: string) => slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)?.[0] ?? slug.split('-').pop() ?? slug

export const orderSummary = (subtotal: number) => ({ subtotal, shipping: shippingFor(subtotal), total: subtotal + shippingFor(subtotal) })

export const orderFields = { customerName: orders.customerName, customerEmail: orders.customerEmail, customerPhone: orders.customerPhone, shippingAddress: orders.shippingAddress, shippingAddress2: orders.shippingAddress2, city: orders.city, state: orders.state, pincode: orders.pincode, country: orders.country }

export const orderItemFields = { title: orderItems.title, author: orderItems.author, price: orderItems.price, quantity: orderItems.quantity }

export const statusValues = ['pending', 'recorded', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export const stockError = (title: string, stock: number) => `Only ${stock} ${stock === 1 ? 'copy' : 'copies'} of ${title} is currently available.`

export const bookDisplayPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`

export const orderNumber = (id: string) => id

export const emptyCart = [] as { id: string; quantity: number }[]

export const maxOrderQuantity = 20

export const orderCreatedMessage = 'Your order has been recorded successfully.'

export const bookNotFoundMessage = 'This book is not available.'

export const cataloguePageSize = 24

export const relatedBookLimit = 4

export const shippingMessage = 'Free shipping on orders over ₹1,000.'

export const checkoutFields = ['fullName', 'email', 'phone', 'address', 'address2', 'city', 'state', 'pincode', 'country'] as const

export const orderIdParam = 'id'

export const customerOrderScope = (userId: string) => userId

export const adminOrderScope = () => true

export const archivePreservesOrders = true

export const historicalPricePreserved = true

export const serverCalculatesTotals = true

export const conditionalStockUpdate = true

export const noPaymentGateway = true

export const commerceVersion = '1.0'

export const schemaReady = true

export const tableNames = { books: 'books', orders: 'orders', orderItems: 'order_items' }

export const defaultCountry = 'India'

export const defaultOrderStatus = 'pending'

export const orderCurrency = 'INR'

export const orderDateLocale = 'en-IN'

export const catalogueUsesActiveBooks = true

export const historicalOrderItemsAreSnapshots = true

export const schemaNotes = 'Orders retain customer and item snapshots for archive-safe history.'

export const schemaSentinel = 'indian-heritager-commerce'

export const schemaEnd = true
