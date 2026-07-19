create extension if not exists pgcrypto;

create table if not exists public.nova_site_state (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  program jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.nova_site_state (id)
values ('primary')
on conflict (id) do nothing;

create table if not exists public.nova_inquiries (
  id uuid primary key default gen_random_uuid(),
  topic text not null check (
    topic in (
      'Student or family',
      'Donor or sponsor',
      'School or educator',
      'Community partner',
      'Other'
    )
  ),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  organization text check (organization is null or char_length(organization) <= 160),
  message text not null check (char_length(message) between 20 and 4000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  internal_notes text not null default '' check (char_length(internal_notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nova_inquiries_created_at_idx
  on public.nova_inquiries (created_at desc);

create index if not exists nova_inquiries_status_idx
  on public.nova_inquiries (status);

alter table public.nova_site_state enable row level security;
alter table public.nova_inquiries enable row level security;

revoke all on public.nova_site_state from anon, authenticated;
revoke all on public.nova_inquiries from anon, authenticated;

grant all on public.nova_site_state to service_role;
grant all on public.nova_inquiries to service_role;
