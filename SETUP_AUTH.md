# ArkAgentic auth setup

This project now supports two modes:

1. **Demo auth mode** for local product walkthroughs right now
2. **Supabase email-link auth** when a real backend project is ready

## Current fastest path: demo auth

The app can now run local sign-up/sign-in without any Supabase project.

Create `.env.local` with:

```bash
NEXT_PUBLIC_ENABLE_DEMO_AUTH=true
NEXT_PUBLIC_INVOICE_EXTRACTOR_URL=http://localhost:3011
```

Then run:

```bash
npm run dev
```

What demo auth does:

- stores a local signed-in user in browser storage
- powers `/signin`, `/signup`, `/account`, `/apps`
- lets you walk through the customer account flow immediately

What demo auth does **not** do:

- real email delivery
- secure backend identity verification
- production-ready auth

## Real path: Supabase auth

When ready, create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_INVOICE_EXTRACTOR_URL=http://localhost:3011
NEXT_PUBLIC_ENABLE_DEMO_AUTH=false
```

## Supabase dashboard setup

In Supabase Auth settings:

1. Enable email sign-in / OTP or magic link
2. Add local redirect URLs such as:
   - `http://127.0.0.1:3000/auth/callback`
   - `http://localhost:3000/auth/callback`
3. Later add production redirect URLs for:
   - `https://www.arkagentic.com/auth/callback`

## Recommended next implementation steps

1. Add a `profiles` table keyed by `auth.users.id`
2. Add `subscriptions` / entitlement tables
3. Add backend token validation in `invoice-extractor`
4. Replace temporary ownership fields with real `user_id`
5. Gate product launch based on entitlement state
