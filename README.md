# Indian Heritage Books

A full-stack Indian heritage book catalogue and commerce experience inspired by the editorial character of [indianheritager.org](https://www.indianheritager.org/). Visitors can browse books by category, view book details, add books to a persistent cart, place orders, and review order history from their account. Administrators can manage the catalogue and orders from a protected dashboard.

## Features

### Public storefront

- Editorial home page with Indian heritage-inspired visual styling
- Responsive catalogue at `/books`
- Category navigation and category-filtered catalogue views
- Book detail pages at `/books/[slug]`
- Typographic cover placeholders for books without uploaded artwork
- Accessible navigation, buttons, forms, labels, and responsive layouts

### Accounts and authentication

- Email and password sign-up at `/sign-up`
- Email and password sign-in at `/sign-in`
- Better Auth sessions backed by Neon Postgres
- Account page at `/account`
- Sign-out support
- Protected order history and order detail pages

### Cart and checkout

- Persistent cart state through the cart provider
- Add and remove books from the cart
- Quantity controls and order totals
- Cart page at `/cart`
- Checkout page at `/checkout`
- Order recording without payment processing
- Confirmation and order detail page at `/orders/[id]`

### Administration

- Protected admin dashboard at `/admin`
- Admin access controlled by `ADMIN_EMAILS`
- Add, edit, archive, restore, and delete catalogue items
- Catalogue visibility and featured-book controls
- Category, price, stock, description, author, publisher, and metadata management
- Admin order list and order status controls

## Technology stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript 5.7
- **UI:** React 19, Tailwind CSS 4, Base UI, Lucide React
- **Styling:** Tailwind CSS with project design tokens and custom global styles
- **Database:** Neon Postgres
- **Database access:** Drizzle ORM over the `pg` driver
- **Authentication:** Better Auth with email/password sessions
- **Validation:** Zod
- **Analytics:** Vercel Analytics
- **Package manager:** pnpm
- **Deployment:** Vercel

## Project structure

```text
app/
  page.tsx                         Home page
  books/page.tsx                   Catalogue and category filters
  books/[slug]/page.tsx            Book detail page
  cart/page.tsx                    Cart page
  checkout/page.tsx                Checkout and order creation
  orders/[id]/page.tsx             Order confirmation/detail
  account/page.tsx                 Customer account and order history
  sign-in/page.tsx                 Sign-in page
  sign-up/page.tsx                 Sign-up page
  admin/page.tsx                   Protected admin dashboard
  admin/catalogue-manager.tsx      Catalogue management UI
  admin/order-manager.tsx          Order management UI
  api/auth/[...all]/route.ts       Better Auth handler
  api/books/route.ts               Public catalogue API
  api/books/[id]/route.ts          Book lookup API
  api/orders/route.ts              Customer order creation and retrieval
  api/admin/books/route.ts         Protected catalogue mutations
  api/admin/orders/route.ts        Protected order administration
components/
  cart-provider.tsx                Cart state and cart actions
lib/
  auth.ts                          Better Auth server configuration
  auth-client.ts                   Better Auth browser client
  categories.ts                    Catalogue category definitions
  db/index.ts                      Shared Postgres pool and Drizzle client
  db/schema.ts                     Auth, catalogue, cart/order schema

next.config.mjs                    Next.js configuration and security headers
```

## Requirements

- Node.js 20.9 or newer
- pnpm 12 or newer
- A Neon Postgres project
- A Vercel project for deployment
- A random `BETTER_AUTH_SECRET` containing at least 32 characters

## Environment variables

Create a local `.env.local` file. Never commit it to Git.

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="a-random-secret-at-least-32-characters-long"
ADMIN_EMAILS="prishasanthosh1@gmail.com"
```

Optional deployment URL configuration:

```env
BETTER_AUTH_URL="https://your-production-domain.example"
```

`BETTER_AUTH_URL` is optional for Vercel deployments. When omitted, the application resolves the deployment URL from Vercel runtime variables. `ADMIN_EMAILS` accepts one or more comma-separated email addresses if additional administrators are needed.

The Vercel project already provides the Neon connection variables and the configured `ADMIN_EMAILS`, `BETTER_AUTH_SECRET`, and `DATABASE_URL` values. For local development, copy the values into `.env.local` using the Vercel project environment settings rather than committing secrets.

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Add the variables shown above to `.env.local`. The auth secret must be at least 32 random characters. Generate one with:

```bash
openssl rand -base64 32
```

Do not paste secrets into source files or commit them.

### 3. Prepare the database

The Neon database must contain the Better Auth tables and the application tables defined in `lib/db/schema.ts`, including catalogue, cart, order, and order-item data.

When using the connected Neon integration, apply schema changes through the Neon SQL tooling. Do not use a client-side database connection or expose `DATABASE_URL` in browser code.

### 4. Start development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create an account

1. Open `/sign-up`.
2. Register with an email address and password.
3. Sign in at `/sign-in` if needed.
4. Confirm that `/account` shows the signed-in account.

### 6. Use the admin dashboard

The configured administrator is:

```text
prishasanthosh1@gmail.com
```

Create or use an account with that email, then open `/admin`. The server checks the authenticated session and compares the email against `ADMIN_EMAILS`; changing the UI alone cannot grant admin access.

## Managing books

1. Sign in with an email included in `ADMIN_EMAILS`.
2. Open `/admin`.
3. Use the catalogue manager to add a book.
4. Enter the title, slug, author, category, price, stock, description, and optional metadata.
5. Save the book and confirm it appears in the catalogue.
6. Use edit to update catalogue details.
7. Use archive to hide a book from the public catalogue without losing its record.
8. Restore an archived book when it should become visible again.
9. Permanently delete a book only when its record is no longer needed.

Archived books are excluded from public catalogue queries. Public catalogue results are also limited to books marked as visible/active by the catalogue API.

## Customer ordering flow

1. Browse `/books`.
2. Open a book detail page.
3. Select a quantity and add the book to the cart.
4. Open `/cart` and review the items.
5. Continue to `/checkout`.
6. Enter the required customer details.
7. Submit the order.
8. Review the confirmation at `/orders/[id]`.
9. View previous orders from `/account`.

Checkout currently records the order in Neon and does not charge a payment method. Payment integration can be added later without changing the catalogue browsing flow.

## Admin order management

Administrators can open `/admin` and use the order manager to:

- Review recent customer orders
- Inspect order items and totals
- See customer and delivery details
- Update order status
- Keep fulfilment progress visible to the administration team

All admin order operations are protected server-side. A user who is not authenticated as an administrator cannot safely call the admin API by hiding or modifying UI elements.

## Useful routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront home page |
| `/books` | Public catalogue |
| `/books?category=indian-literature` | Filtered catalogue |
| `/books/[slug]` | Book details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout and order recording |
| `/account` | Account and order history |
| `/orders/[id]` | Order details |
| `/sign-in` | Customer/admin sign-in |
| `/sign-up` | Account creation |
| `/admin` | Protected admin dashboard |
| `/api/books` | Public catalogue API |
| `/api/orders` | Authenticated customer order API |
| `/api/admin/books` | Admin catalogue API |
| `/api/admin/orders` | Admin order API |

## Security model

- Better Auth handles password hashing and session management.
- Authentication is checked on the server for protected pages and mutations.
- Admin access is verified using the authenticated user email and `ADMIN_EMAILS`.
- User-owned order reads are scoped to the current session user.
- Database queries use Drizzle and parameterized query construction.
- Secrets remain in environment variables and are never sent to client components.
- Production response headers are configured in `next.config.mjs`.

## Verification checklist

Before deploying, verify:

- The home page loads at desktop and mobile widths.
- Catalogue pages load with an empty catalogue and with real books.
- Category links open the correct filtered catalogue.
- Sign-up, sign-in, reload, and sign-out work.
- A signed-in customer can add a book to the cart and submit an order.
- The customer can see only their own order history.
- A non-admin account cannot access admin operations.
- The configured admin can add, edit, archive, restore, and delete books.
- The configured admin can view and update orders.
- `pnpm build` completes successfully.

Run the production build locally with:

```bash
pnpm build
pnpm start
```

## Deployment to Vercel

### Using the Vercel dashboard

1. Import or connect the repository to Vercel.
2. Select the project root as the application root.
3. Confirm the framework is detected as Next.js.
4. Add the production environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `ADMIN_EMAILS`
   - `BETTER_AUTH_URL` if using a fixed custom auth URL
5. Deploy.
6. Open the deployed site and test sign-in, catalogue browsing, checkout, account history, and `/admin`.

### Using the Vercel CLI

```bash
pnpm dlx vercel login
pnpm dlx vercel link
pnpm dlx vercel env add BETTER_AUTH_SECRET production
pnpm dlx vercel env add ADMIN_EMAILS production
pnpm dlx vercel env add DATABASE_URL production
pnpm dlx vercel --prod
```

Prefer the project’s existing Vercel integration values when they are already configured. Do not replace an integration-provided Neon connection string with a hardcoded local value.

## Production considerations

- Use a separate Neon branch or database for production data when appropriate.
- Keep `BETTER_AUTH_SECRET` stable after launch; rotating it invalidates existing sessions.
- Restrict `ADMIN_EMAILS` to trusted administrators.
- Add payment processing only after validating server-side price and quantity handling.
- Add transactional email for order confirmations when the fulfilment workflow is ready.
- Add image storage when real book cover assets replace typographic placeholders.
- Monitor Vercel logs and database errors after deployment.

## Development commands

```bash
pnpm dev       # Start the Next.js development server
pnpm build     # Create a production build
pnpm start     # Serve the production build
```

## Troubleshooting

### Sign-in succeeds but the account appears logged out

Confirm that `BETTER_AUTH_SECRET` is set and that the Better Auth development cookie configuration is present. Also verify that the current preview/deployment origin is trusted by the auth configuration.

### `/admin` is unavailable

Confirm that the signed-in account email exactly matches one of the comma-separated addresses in `ADMIN_EMAILS`. Then verify the environment variable is present in the environment where the app is running and redeploy after changing it.

### Books do not appear

Confirm the book is not archived, has public visibility enabled, and has valid catalogue fields. Check the `/api/books` response and server logs for database errors.

### Orders cannot be created

Confirm the customer is signed in, the requested book IDs exist and are active, quantities are positive, and the order tables are present in Neon.

## License and content

This project is an application implementation for an Indian heritage book catalogue. Ensure that all book metadata, cover artwork, excerpts, and editorial content used in production are properly licensed or owned by the site operator.

## Maintainers

The primary administrator configured for this deployment is `prishasanthosh1@gmail.com`.

For Vercel project or deployment support, use the Vercel project settings and deployment logs. For Vercel platform support, open a ticket at [vercel.com/help](https://vercel.com/help).

----

Built with Next.js, Neon, Drizzle, and Better Auth.

## Setup note

This README documents the current application architecture and the deployment workflow. Keep it updated when adding payment processing, image uploads, additional administrators, or new order statuses.

## Data ownership

The project stores account, catalogue, cart, and order data in the connected Neon database. Treat production database contents as operational data and restrict access to trusted project maintainers.

## Further extension ideas

- Payment provider integration
- Real cover image uploads
- Search and advanced filtering
- Inventory alerts
- Email order confirmations
- CSV catalogue import/export
- Customer wishlists
- Role-based administration beyond email allowlisting

## Final release checklist

- [ ] Environment variables configured in Development, Preview, and Production
- [ ] Database schema applied to the target Neon database
- [ ] Admin email verified
- [ ] Test account created
- [ ] Test book added and published
- [ ] Test order created and visible to the customer
- [ ] Admin order status updated
- [ ] Production build passed
- [ ] Preview and production smoke-tested
- [ ] Domain and HTTPS configured
- [ ] Secrets excluded from the repository

## Document status

This document is the operational README for the current codebase. Update the routes, schema notes, environment variables, and verification checklist whenever the application’s behavior changes.

## Quick start summary

```bash
pnpm install
pnpm dev
```

Then visit `/sign-up`, create the administrator account using `prishasanthosh1@gmail.com`, sign in, and open `/admin` to manage the catalogue and orders.

## Support

For application issues, inspect the browser console, Next.js server output, Vercel deployment logs, and Neon database errors. Do not expose database URLs, auth secrets, password hashes, session tokens, or other credentials in issue reports.

## Change management

Make schema changes through the connected Neon workflow, update `lib/db/schema.ts`, validate affected API routes, run the production build, and smoke-test the affected customer and admin flows before deploying.

## End

The application is ready to be extended as a catalogue-driven Indian heritage books storefront with authenticated customer ordering and protected administration.

----

### At-a-glance ownership

- **Storefront UI:** `app/page.tsx`, `app/books/page.tsx`, `app/books/[slug]/page.tsx`
- **Commerce UI:** `components/cart-provider.tsx`, `app/cart/page.tsx`, `app/checkout/page.tsx`
- **Customer data:** `app/account/page.tsx`, `app/orders/[id]/page.tsx`, `app/api/orders/route.ts`
- **Admin data:** `app/admin/*`, `app/api/admin/*`
- **Authentication:** `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`
- **Persistence:** `lib/db/index.ts`, `lib/db/schema.ts`

Keep credentials out of the repository and use Vercel environment variables for every deployment environment.

----

### Recommended first production test

1. Create a customer account with a non-admin email.
2. Add a published book to the cart.
3. Submit an order and verify it appears in that customer’s account.
4. Sign out.
5. Sign in with `prishasanthosh1@gmail.com`.
6. Open `/admin` and verify the book and order appear.
7. Update the order status.
8. Return to the customer account and confirm the order detail remains available.

This test validates the principal authentication, authorization, catalogue, cart, checkout, order, and administration paths together.

----

### Configuration reminder

`ADMIN_EMAILS` is an allowlist, not a password. Every administrator must still create an account and authenticate through Better Auth. If the email is changed, update the environment variable in each deployment environment and redeploy.

----

### Repository hygiene

Do not commit `.env.local`, database dumps, session data, generated secrets, or customer/order exports. Review changes to `lib/auth.ts`, `lib/db/schema.ts`, and `app/api/admin/*` carefully because they affect security and persisted data.

----

### Release ownership

The deployment owner should verify the Vercel project’s environment variables, Neon connection, domain configuration, admin allowlist, and smoke-test results before announcing the storefront publicly.

----

### End of README

For the shortest local start path, configure the environment, run `pnpm install`, then run `pnpm dev`. For the shortest admin path, register `prishasanthosh1@gmail.com`, sign in, and open `/admin`.

----

### Maintainer note

This README intentionally documents both current functionality and safe next steps. Features such as payments, image uploads, and email notifications are not assumed to exist until they are implemented and verified.

----

### Operational reminder

Always validate authorization on the server. Client-side links and hidden controls are only presentation; they are not a security boundary.

----

### End of document

The source of truth for runtime behavior remains the application code, database schema, and configured deployment environment.

----

### Final note

Use this README as the onboarding document for developers, administrators, and deployment maintainers.

----

### Done

Project documentation complete.
