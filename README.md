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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Signup protection

Public registration stays open, but signup can be protected with Cloudflare Turnstile and email-confirmation gating.

1. Create a Cloudflare Turnstile widget for the production domain.
2. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in Amplify / local env.
3. In Supabase Auth CAPTCHA settings, enable Turnstile and set the matching Turnstile secret key.
4. Keep Supabase email confirmation enabled so newly created accounts cannot launch apps until `email_confirmed_at` is set.

Stale unverified account cleanup is dry-run by default:

```bash
npm run auth:cleanup-unverified
```

To delete unverified users older than the configured age, run from a trusted server/CI environment with `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set:

```bash
npm run auth:cleanup-unverified -- --apply --max-age-hours=48 --limit=100
```

Schedule that command daily (or more often during active bot abuse). Never expose the service-role key to the browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
