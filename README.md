# Coziture — Next.js migration

The PHP app remains in the parent folder. This folder contains the deployable Next.js App Router application with PostgreSQL, NextAuth credentials/JWT sessions, bcrypt, and Tailwind plus responsive custom styles.

## Local setup

Use Node.js 22 or newer. From this folder:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Set DATABASE_URL to your Neon connection string (prefer the pooled endpoint including TLS parameters), NEXTAUTH_URL to http://localhost:3000, and NEXTAUTH_SECRET to a random secret. Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` and keep it private.

For a new store, set ADMIN_EMAIL and ADMIN_PASSWORD (12–72 bytes) in .env.local, then run `npm run seed` and `npm run dev`. Remove those bootstrap variables afterward. Seeding preserves records and never changes an existing account's password or role. No public seed API is exposed.

Without DATABASE_URL the app shows a labelled sample catalog. Accounts and checkout require PostgreSQL.

## Transfer the existing MySQL store

Back up MySQL and stop checkout writes during final cutover. Run the existing PHP store migrations first. Use an empty Neon database or branch; do not seed it before importing. From this folder:

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
C:\xampp\php\php.exe scripts/export-mysql.php | node scripts/import-mysql.mjs
npm run seed
```

The exporter reads the parent application's MySQL configuration. The importer refuses a nonempty target and imports in one transaction. IDs, bcrypt password hashes (including PHP $2y$), roles, inventory, settings and order snapshots are preserved. Legacy checkout tokens are converted deterministically to UUIDs and serial sequences advance. Constraint failures roll back the whole import. Source data is never modified. Exported timestamps are UTC.

The stream contains personal data and password hashes: do not commit or publish it. PHP sessions, guest carts and saved items cannot transfer; users sign in again. New carts and saved items persist in browser local storage and are device-specific.

Images are copied to public/shop and public/media/products. If source uploads change, copy the latest ../media/products again before deployment. Admin image fields accept HTTPS URLs or bundled paths. Upload new images to an image host (Vercel Blob can be configured separately), then paste the URL. Runtime filesystem uploads and base64 storage are not used.

## Preserved functionality

Storefront: homepage, catalog search/filter/sort, product pages, cart, delivery/payment checkout, registration/login, account/order history, saved items, About, Contact, Shipping and Privacy.

Admin: statistics, product CRUD and visibility, categories with cascading renames, fulfillment, tracking/private notes, manual payment reconciliation, payment configuration, customer roles and store settings. Admin order lists show the latest 500 orders; older orders remain accessible by ID and through customer history.

Checkout recalculates totals server-side, locks inventory, and commits orders and stock together. Retry keys prevent duplicate orders. Cancellation restores inventory once. Fulfillment cannot reverse terminal states. Products with order history cannot be deleted. Customer order reads enforce ownership; admin APIs and pages query current database roles. Mutations require same-origin JSON. NextAuth handles auth CSRF. Database-backed throttling limits repeated login attempts across serverless instances.

Payment methods are manual cash on delivery, bank transfer and mobile wallet. The app does not charge cards, initiate transfers or issue refunds; staff reconcile payments and record status.

## Verification

Run `npm test` and `npm run build`. Tests use isolated in-memory PostgreSQL and do not access DATABASE_URL. They cover schema, checkout totals/snapshots, retry idempotency, rollback, cancellation and fulfillment. Verify a complete workflow against a Neon preview branch before production cutover.

## Vercel deployment

1. Create Neon and seed or import as above.
2. Push the app to your GitHub repository. When publishing the parent repository, set Vercel Root Directory to `nextapp`; when publishing this folder alone, use `.`.
3. Select Next.js, Node.js 22 or newer, build command `npm run build`.
4. Configure DATABASE_URL, NEXTAUTH_SECRET and NEXTAUTH_URL. The auth URL must match the exact HTTPS deployment/custom domain. Preview deployments need a matching URL and preferably a separate Neon branch.
5. Deploy, sign in as administrator, review contact/policy/shipping/payment settings and exercise checkout before switching traffic.

Never prefix credentials with NEXT_PUBLIC_. Keep .env.local, exports and caches out of Git. Migrations are not run during builds or requests.

Vercel Hobby is for personal, non-commercial use; a commercial store needs an eligible paid plan. See [Vercel Hobby](https://vercel.com/docs/plans/hobby). Check Neon and hosting limits before launch.

References: [NextAuth credentials](https://next-auth.js.org/providers/credentials), [Neon connection guide](https://neon.com/docs/get-started-with-neon/connect-neon).
