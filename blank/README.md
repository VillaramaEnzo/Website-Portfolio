This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Secret `/ily` Page Setup

The `/ily` route supports password login and QR unlock.

1. Create or edit `.env.local` and add:

```bash
ILY_PAGE_PASSWORD=your-secret-password-here
ILY_QR_SIGNING_SECRET=replace-with-a-long-random-secret
# Optional (defaults to 1209600 = 14 days)
# ILY_QR_TTL_SECONDS=1209600
```

2. Start the app and visit `/ily`.
   - If not authenticated, you will be redirected to `/ily/login`.
   - Enter the password to unlock the page (backup access).

3. Generate a QR unlock URL:
   - Open `/ily/qr-link` while running locally.
   - Copy the generated unlock URL.
   - Paste that URL into any QR generator to create a scannable QR code.

4. Share/print the QR code.
   - Scanning the QR opens `/ily/unlock?token=...`, validates the signed token, sets the auth cookie, and redirects to `/ily`.
   - If a token is invalid or expired, users are sent to `/ily/login`.

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
