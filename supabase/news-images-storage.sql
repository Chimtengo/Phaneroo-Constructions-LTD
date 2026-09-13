-- Run this only if you already ran schema.sql before News image uploads were added.
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view news images" on storage.objects;
drop policy if exists "Admins can upload news images" on storage.objects;

create policy "Public can view news images"
on storage.objects for select
using (bucket_id = 'news-images');

create policy "Admins can upload news images"
on storage.objects for insert to authenticated
with check (bucket_id = 'news-images' and (select public.is_admin()));
