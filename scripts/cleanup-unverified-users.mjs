#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const maxAgeArg = process.argv.find((arg) => arg.startsWith('--max-age-hours='));
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const maxAgeHours = Number(maxAgeArg?.split('=')[1] || process.env.UNVERIFIED_USER_MAX_AGE_HOURS || 48);
const deleteLimit = Number(limitArg?.split('=')[1] || process.env.UNVERIFIED_USER_DELETE_LIMIT || 100);

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (!Number.isFinite(maxAgeHours) || maxAgeHours <= 0) {
  console.error('--max-age-hours must be a positive number.');
  process.exit(1);
}

if (!Number.isFinite(deleteLimit) || deleteLimit <= 0) {
  console.error('--limit must be a positive number.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const cutoffMs = Date.now() - maxAgeHours * 60 * 60 * 1000;
const candidates = [];
let page = 1;
const perPage = 100;

while (candidates.length < deleteLimit) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
  if (error) {
    console.error(`Failed to list users: ${error.message}`);
    process.exit(1);
  }

  const users = data?.users || [];
  if (users.length === 0) break;

  for (const user of users) {
    const createdAtMs = user.created_at ? Date.parse(user.created_at) : NaN;
    const isOldEnough = Number.isFinite(createdAtMs) && createdAtMs < cutoffMs;
    const isConfirmed = Boolean(user.email_confirmed_at || user.confirmed_at);
    const hasSignedIn = Boolean(user.last_sign_in_at);

    if (isOldEnough && !isConfirmed && !hasSignedIn) {
      candidates.push(user);
      if (candidates.length >= deleteLimit) break;
    }
  }

  if (users.length < perPage) break;
  page += 1;
}

console.log(`${apply ? 'Deleting' : 'Dry run: would delete'} ${candidates.length} unverified users older than ${maxAgeHours} hours.`);

for (const user of candidates) {
  const label = `${user.id} ${user.email || '(no email)'} created=${user.created_at}`;
  if (!apply) {
    console.log(`DRY_RUN ${label}`);
    continue;
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) {
    console.error(`FAILED ${label}: ${error.message}`);
  } else {
    console.log(`DELETED ${label}`);
  }
}

if (!apply) {
  console.log('No users were deleted. Re-run with --apply to delete the listed users.');
}
