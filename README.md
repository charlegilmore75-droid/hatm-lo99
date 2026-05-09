# HATM - منصة خدمات التواصل الاجتماعي

Full-stack provider panel built with Next.js 14, Prisma, PostgreSQL.
Arabic + English with RTL. Black premium theme.

## Deploy to Railway

1. Push this folder to GitHub.
2. Create a new Railway project from the repo.
3. Add environment variables (see `.env.example`):
   - `DATABASE_URL` (your PostgreSQL URL)
   - `JWT_SECRET` (random long string)
   - `PROVIDER_API_URL` and `PROVIDER_API_KEY`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
4. Deploy. The build runs `prisma db push` automatically.
5. After first deploy, visit `/api/seed?key=<JWT_SECRET>` to seed the admin and demo data.

## Local

```bash
npm install
cp .env.example .env   # fill in values
npm run build
npm run start
```

The server uses `process.env.PORT` automatically.

## Default Admin
- email: value of `ADMIN_EMAIL`
- password: value of `ADMIN_PASSWORD`
