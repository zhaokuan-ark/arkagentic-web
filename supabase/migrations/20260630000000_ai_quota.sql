-- Migration: AI quota columns on subscriptions + ai_quota_topups table
-- Run in Supabase SQL Editor

-- ─── Add quota columns to subscriptions ─────────────────────────────────────
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS ai_quota_monthly    INTEGER NOT NULL DEFAULT 200,
  ADD COLUMN IF NOT EXISTS ai_quota_remaining  INTEGER NOT NULL DEFAULT 200;

-- Existing rows that are active/trialing get their quota seeded
UPDATE subscriptions
  SET ai_quota_remaining = 200
  WHERE status IN ('trialing', 'active') AND ai_quota_remaining = 0;

-- ─── ai_quota_topups ─────────────────────────────────────────────────────────
-- Records every top-up purchase so we have a full audit trail.
CREATE TABLE IF NOT EXISTS ai_quota_topups (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_id     TEXT        NOT NULL UNIQUE,  -- payment_intent or checkout session id
  amount_aud            NUMERIC(10,2) NOT NULL,
  quota_added           INTEGER     NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_quota_topups_user_id
  ON ai_quota_topups(user_id);

ALTER TABLE ai_quota_topups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own topups"
  ON ai_quota_topups FOR SELECT
  USING (auth.uid() = user_id);

GRANT ALL ON public.ai_quota_topups TO service_role;

-- ─── Helper function: grant monthly quota on renewal ─────────────────────────
-- Called by webhook when invoice.payment_succeeded fires for a subscription renewal.
CREATE OR REPLACE FUNCTION reset_monthly_ai_quota(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE subscriptions
    SET ai_quota_remaining = ai_quota_monthly
    WHERE user_id = p_user_id
      AND status IN ('active', 'trialing');
END;
$$;

-- ─── Helper function: add top-up quota ───────────────────────────────────────
CREATE OR REPLACE FUNCTION add_topup_ai_quota(p_user_id UUID, p_quota INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE subscriptions
    SET ai_quota_remaining = ai_quota_remaining + p_quota
    WHERE user_id = p_user_id
      AND status IN ('active', 'trialing');
END;
$$;

-- ─── Helper function: deduct quota (returns false if insufficient) ────────────
CREATE OR REPLACE FUNCTION deduct_ai_quota(p_user_id UUID, p_amount INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_remaining INTEGER;
BEGIN
  SELECT ai_quota_remaining INTO v_remaining
    FROM subscriptions
    WHERE user_id = p_user_id AND status IN ('active', 'trialing')
    LIMIT 1;

  IF v_remaining IS NULL OR v_remaining < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE subscriptions
    SET ai_quota_remaining = ai_quota_remaining - p_amount
    WHERE user_id = p_user_id AND status IN ('active', 'trialing');

  RETURN TRUE;
END;
$$;
