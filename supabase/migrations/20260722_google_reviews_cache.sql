-- Cached Google Places rating/review count for the site badge

create table if not exists public.google_reviews_cache (
  id text primary key default 'default' check (id = 'default'),
  rating numeric(2, 1) not null default 5.0,
  review_count integer not null default 50,
  maps_url text not null default '',
  source text not null default 'fallback' check (source in ('places', 'fallback')),
  fetched_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.google_reviews_cache (id, rating, review_count, maps_url, source)
values ('default', 5.0, 50, '', 'fallback')
on conflict (id) do nothing;

drop trigger if exists trg_google_reviews_cache_updated_at on public.google_reviews_cache;
create trigger trg_google_reviews_cache_updated_at
before update on public.google_reviews_cache
for each row execute function public.set_updated_at();

alter table public.google_reviews_cache enable row level security;

drop policy if exists "public_read_google_reviews_cache" on public.google_reviews_cache;
create policy "public_read_google_reviews_cache"
on public.google_reviews_cache
for select
using (true);

drop policy if exists "admin_all_google_reviews_cache" on public.google_reviews_cache;
create policy "admin_all_google_reviews_cache"
on public.google_reviews_cache
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
