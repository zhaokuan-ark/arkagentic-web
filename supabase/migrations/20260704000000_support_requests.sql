-- Migration: support_requests table
-- Stores contact/support form submissions from the website.

create table if not exists public.support_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  topic       text,
  message     text not null,
  status      text not null default 'open',   -- open | in_progress | resolved
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for listing by recency and filtering by status
create index if not exists support_requests_created_at_idx on public.support_requests (created_at desc);
create index if not exists support_requests_status_idx    on public.support_requests (status);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists support_requests_updated_at on public.support_requests;
create trigger support_requests_updated_at
  before update on public.support_requests
  for each row execute procedure public.set_updated_at();

-- Service role has full access; anon/authenticated cannot read support data
alter table public.support_requests enable row level security;
create policy "service_role_all" on public.support_requests
  using (true) with check (true);
