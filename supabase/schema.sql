-- Run this entire file in Supabase: SQL Editor > New query.
-- Then create an Auth user in Authentication > Users and add that user's UUID below.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  excerpt text not null check (char_length(excerpt) between 10 and 1000),
  content text not null check (char_length(content) between 10 and 10000),
  category text not null default 'News' check (char_length(category) <= 40),
  image_url text,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  description text not null check (char_length(description) between 10 and 3000),
  employment_type text not null default 'Full Time' check (char_length(employment_type) <= 50),
  location text not null default 'Lilongwe' check (char_length(location) <= 100),
  application_email text,
  closing_date date,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.news_posts enable row level security;
alter table public.vacancies enable row level security;

-- Storage for News images only. The bucket is public so site visitors can view images.
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do update set public = true;

create policy "Public can view news images"
on storage.objects for select
using (bucket_id = 'news-images');

create policy "Admins can upload news images"
on storage.objects for insert to authenticated
with check (bucket_id = 'news-images' and (select public.is_admin()));

create policy "Public can read published news" on public.news_posts for select using (is_published = true);
create policy "Admins manage news" on public.news_posts for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public can read published vacancies" on public.vacancies for select using (is_published = true);
create policy "Admins manage vacancies" on public.vacancies for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- If you ran an earlier version of this schema, run these lines too.
alter table public.news_posts add column if not exists content text;
update public.news_posts set content = excerpt where content is null;
alter table public.news_posts alter column content set not null;

-- Replace with the UUID of the Auth user who may publish content.
-- insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000000');
