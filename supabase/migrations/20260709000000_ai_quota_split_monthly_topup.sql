-- Migration: Split ai_quota_remaining into separate monthly + topup columns
-- Purpose: enforce "monthly quota consumed first, then topup" ordering
-- Previously a single ai_quota_remaining pool made topup decrease first (display bug + wrong semantics)

-- ─── New columns ─────────────────────────────────────────────────────────────
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS ai_quota_monthly_remaining INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_quota_topup_remaining   INTEGER NOT NULL DEFAULT 0;

-- ─── Migrate existing data ────────────────────────────────────────────────────
-- Split current ai_quota_remaining into monthly + topup using same formula
-- the frontend was using: monthly = min(remaining, monthly_cap), topup = remainder
UPDATE subscriptions SET
  ai_quota_monthly_remaining = LEAST(ai_quota_remaining, ai_quota_monthly),
  ai_quota_topup_remaining   = GREATEST(0, ai_quota_remaining - ai_quota_monthly);

-- ─── deduct_ai_quota: monthly first, then topup ──────────────────────────────
CREATE OR REPLACE FUNCTION deduct_ai_quota(p_user_id UUID, p_amount INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_monthly     INTEGER;
  v_topup       INTEGER;
  v_from_monthly INTEGER;
  v_from_topup  INTEGER;
BEGIN
  SELECT ai_quota_monthly_remaining, ai_quota_topup_remaining
    INTO v_monthly, v_topup
    FROM subscriptions
    WHERE user_id = p_user_id AND status IN ('active', 'trialing')
    LIMIT 1;

  -- Fail if total insufficient
  IF COALESCE(v_monthly, 0) + COALESCE(v_topup, 0) < p_amount THEN
    RETURN FALSE;
  END IF;

  -- Consume monthly first, then topup for the remainder
  v_from_monthly := LEAST(p_amount, COALESCE(v_monthly, 0));
  v_from_topup   := p_amount - v_from_monthly;

  UPDATE subscriptions SET
    ai_quota_monthly_remaining = ai_quota_monthly_remaining - v_from_monthly,
    ai_quota_topup_remaining   = ai_quota_topup_remaining   - v_from_topup,
    ai_quota_remaining         = ai_quota_remaining - p_amount  -- keep in sync for backward compat
    WHERE user_id = p_user_id AND status IN ('active', 'trialing');

  RETURN TRUE;
END;
$$;

-- ─── reset_monthly_ai_quota: only reset monthly, topup untouched ─────────────
CREATE OR REPLACE FUNCTION reset_monthly_ai_quota(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE subscriptions SET
    ai_quota_monthly_remaining = ai_quota_monthly,
    -- ai_quota_remaining = monthly_cap + topup_remaining (keep in sync)
    ai_quota_remaining = ai_quota_monthly + ai_quota_topup_remaining
    WHERE user_id = p_user_id AND status IN ('active', 'trialing');
END;
$$;

-- ─── add_topup_ai_quota: add to topup_remaining only ─────────────────────────
CREATE OR REPLACE FUNCTION add_topup_ai_quota(p_user_id UUID, p_quota INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE subscriptions SET
    ai_quota_topup_remaining = ai_quota_topup_remaining + p_quota,
    ai_quota_remaining       = ai_quota_remaining + p_quota  -- keep in sync
    WHERE user_id = p_user_id AND status IN ('active', 'trialing');
END;
$$;
