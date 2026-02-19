This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# db reset and seed

```bash
# seed data to db
npx prisma db seed
 
# To reset data in the db
npx prisma migrate reset --force
```

# Personas

1. Fellows - providers who conduct therapy sessions
2. Supervisors -  oversight on therapy session recordings