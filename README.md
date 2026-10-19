# Portfolio — Ablam Jules Amenoussi

Bilingual (FR/EN) portfolio with a small admin to manage projects, skills and
experience. Next.js 16 (App Router, Cache Components), Prisma 7 + PostgreSQL
(Neon in production).

## Structure

| Path | Role |
| --- | --- |
| `app/[locale]/` | Public site. French at `/`, English at `/en` (see `proxy.ts`). |
| `app/admin/` | Admin (`/admin`), French only, protected by a session cookie. |
| `app/admin/actions/` | Server Actions: every write re-checks the session and refreshes the public cache (`updateTag`). |
| `lib/content/` | Read access for the public site. `data.ts` holds static profile text; projects, skills and experiences come from the database. |
| `prisma/` | Schema, migrations and seed (initial content). |
| `dictionaries/` | Interface strings per language. |

## Local setup

1. `npm install` (also generates the Prisma client).
2. Copy `.env.example` to `.env` and fill it in:
   - `DATABASE_URL`: a PostgreSQL database (local or a Neon branch).
   - `SESSION_SECRET`: 32+ random characters.
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` (run `npm run admin:hash`).
3. `npm run db:migrate` then `npm run db:seed`.
4. `npm run dev` — site on http://localhost:3000, admin on http://localhost:3000/admin.

## Production (Neon)

1. Create a Neon project and copy its **pooled** connection string.
2. Set `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` in the hosting provider.
3. Apply migrations once with `npm run db:deploy` (with `DATABASE_URL` pointing to Neon), then `npm run db:seed` for the initial content.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create/apply a migration in development |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:seed` | Insert the initial content (safe to re-run) |
| `npm run admin:hash` | Print `ADMIN_PASSWORD_HASH` for a password you type |
