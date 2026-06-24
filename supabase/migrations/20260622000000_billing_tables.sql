-- Migration: Phase 2 billing tables
-- Run in Supabase SQL Editor or via supabase db push

-- ─── subscriptions ────────────────────────────────────────────────────────────
-- Tracks active Stripe subscriptions per user.
-- Status values: trialing | active | past_due | canceled | unpaid
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT        NOT NULL,
  stripe_subscription_id  TEXT        NOT NULL UNIQUE,
  status                  TEXT        NOT NULL DEFAULT 'trialing'
                          CHECK (status IN ('trialing','active','past_due','canceled','unpaid')),
  plan_id                 TEXT        NOT NULL DEFAULT 'invoice_extractor_monthly',
  trial_ends_at           TIMESTAMPTZ,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN     NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON subscriptions(stripe_customer_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: users can only read their own subscription
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role has full access (for webhook handler)
GRANT ALL ON public.subscriptions TO service_role;


-- ─── trial_fingerprints ───────────────────────────────────────────────────────
-- Records IP/device fingerprints at trial start to prevent abuse.
-- We store SHA-256 hash of IP (never plain IP) to balance privacy + detection.
CREATE TABLE IF NOT EXISTS trial_fingerprints (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_hash             TEXT        NOT NULL,   -- SHA-256(ip_address)
  device_fp_hash      TEXT,                   -- optional: browser fingerprint hash
  trial_started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trial_fingerprints_ip_hash
  ON trial_fingerprints(ip_hash);

CREATE INDEX IF NOT EXISTS idx_trial_fingerprints_user_id
  ON trial_fingerprints(user_id);

-- RLS: no user-level read needed; service role manages this table
ALTER TABLE trial_fingerprints ENABLE ROW LEVEL SECURITY;
-- (No user-facing policies -- only service role access via webhook/API)

-- Service role has full access
GRANT ALL ON public.trial_fingerprints TO service_role;


-- ─── stripe_customers ─────────────────────────────────────────────────────────
-- Maps Supabase user_id to Stripe customer_id for easy lookup.
CREATE TABLE IF NOT EXISTS stripe_customers (
  user_id            UUID  PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT  NOT NULL UNIQUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stripe customer"
  ON stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

-- Service role has full access
GRANT ALL ON public.stripe_customers TO service_role;
