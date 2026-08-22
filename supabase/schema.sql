-- SubZero Subscriptions Table Schema with Strict Multi-User Security
-- Copy and run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Create table with user_id linked to auth.users
create table if not exists public.subscriptions (
  id text primary key,
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  cost numeric not null,
  cycle text not null check (cycle in ('monthly', 'annual')),
  category text not null,
  next_billing text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- If table already existed without user_id, ensure column exists
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'subscriptions' and column_name = 'user_id'
  ) then
    alter table public.subscriptions add column user_id uuid references auth.users default auth.uid();
  end if;
end $$;

-- 2. Enable Row Level Security (RLS)
alter table public.subscriptions enable row level security;

-- 3. Drop any older conflicting policies
drop policy if exists "Public access to subscriptions" on public.subscriptions;
drop policy if exists "Users can only access their own subscriptions" on public.subscriptions;
drop policy if exists "Users can view own subscriptions" on public.subscriptions;
drop policy if exists "Users can insert own subscriptions" on public.subscriptions;
drop policy if exists "Users can update own subscriptions" on public.subscriptions;
drop policy if exists "Users can delete own subscriptions" on public.subscriptions;
drop policy if exists "Users can manage own subscriptions" on public.subscriptions;

-- 4. Unified Full CRUD Security Policy for Authenticated Owners
create policy "Users can manage own subscriptions"
  on public.subscriptions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Safe Realtime Publication check (avoids duplicate publication error)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'subscriptions'
  ) then
    alter publication supabase_realtime add table public.subscriptions;
  end if;
end $$;
