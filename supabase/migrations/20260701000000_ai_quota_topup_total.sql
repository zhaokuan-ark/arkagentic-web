-- Migration: track lifetime top-up total so UI can show a depletion bar
-- Run in Supabase SQL Editor

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS ai_quota_topup_total INTEGER NOT NULL DEFAULT 0;

-- Backfill from existing topups table
UPDATE subscriptions s
  SET ai_quota_topup_total = COALESCE((
    SELECT SUM(quota_added) FROM ai_quota_topups t WHERE t.user_id = s.user_id
  ), 0);

-- Update add_topup_ai_quota to also increment the total tracker
CREATE OR REPLACE FUNCTION add_topup_ai_quota(p_user_id UUID, p_quota INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE subscriptions
    SET ai_quota_remaining    = ai_quota_remaining + p_quota,
        ai_quota_topup_total  = ai_quota_topup_total + p_quota
    WHERE user_id = p_user_id
      AND status IN ('active', 'trialing');
END;
$$;

-- Also fix reset_monthly_ai_quota: ADD monthly allowance instead of replacing
-- so top-up balance survives across renewal cycles
CREATE OR REPLACE FUNCTION reset_monthly_ai_quota(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE subscriptions
    SET ai_quota_remaining = ai_quota_remaining + ai_quota_monthly
    WHERE user_id = p_user_id
      AND status IN ('active', 'trialing');
END;
$$;
