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

# generate AUTH_SECRET

```bash
openssl rand -base64 32
```

# Personas

1. Fellows - providers who conduct therapy sessions
2. Supervisors - oversight on therapy session recordings

# Login Creds

- email > espiramarvin@gmail.com
- password > 12345678
