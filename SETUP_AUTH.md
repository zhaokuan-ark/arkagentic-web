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

## Public signup anti-bot protection

Signup remains open to real users. To add bot filtering, create a Cloudflare Turnstile widget and add:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

Then configure the matching Turnstile secret in Supabase Auth CAPTCHA settings. The signup form will pass the Turnstile token to Supabase automatically when the site key is present.

Unverified users are allowed to create an account, but they cannot launch Invoice Extractor until their email is confirmed.

## Cleanup stale unverified users

The repo includes a dry-run-first cleanup script:

```bash
npm run auth:cleanup-unverified
npm run auth:cleanup-unverified -- --max-age-hours=48 --apply
```

It deletes only users that are all of the following:

- older than the configured threshold, default 48 hours
- email not confirmed
- never signed in

For scheduled cleanup, enable the GitHub Actions workflow `docs/templates/cleanup-unverified-users.github-actions.yml` by adding repository secrets:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Copy this template into `.github/workflows/cleanup-unverified-users.yml` when the GitHub token/repository is allowed to create workflows. The workflow runs daily and can also be triggered manually as a dry run or apply run.

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
