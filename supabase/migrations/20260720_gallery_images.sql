-- Gallery images (draft + published snapshots) with Cloudinary metadata

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  stage text not null check (stage in ('draft', 'published')),
  image_url text not null,
  image_public_id text,
  image_alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_images_stage_sort
  on public.gallery_images (stage, sort_order asc);

drop trigger if exists trg_gallery_images_updated_at on public.gallery_images;
create trigger trg_gallery_images_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

alter table public.gallery_images enable row level security;

drop policy if exists "public_read_published_gallery_images" on public.gallery_images;
create policy "public_read_published_gallery_images"
on public.gallery_images
for select
using (stage = 'published');

drop policy if exists "admin_all_gallery_images" on public.gallery_images;
create policy "admin_all_gallery_images"
on public.gallery_images
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Singleton settings for gallery page visibility

create table if not exists public.gallery_settings (
  id text primary key default 'default' check (id = 'default'),
  gallery_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.gallery_settings (id)
values ('default')
on conflict (id) do nothing;

drop trigger if exists trg_gallery_settings_updated_at on public.gallery_settings;
create trigger trg_gallery_settings_updated_at
before update on public.gallery_settings
for each row execute function public.set_updated_at();

alter table public.gallery_settings enable row level security;

drop policy if exists "public_read_gallery_settings" on public.gallery_settings;
create policy "public_read_gallery_settings"
on public.gallery_settings
for select
using (true);

drop policy if exists "admin_all_gallery_settings" on public.gallery_settings;
create policy "admin_all_gallery_settings"
on public.gallery_settings
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Replace published gallery images from draft in one transaction

create or replace function public.publish_gallery_images_from_draft()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.gallery_images where stage = 'published';
  insert into public.gallery_images (stage, image_url, image_public_id, image_alt, sort_order)
  select 'published'::text, d.image_url, d.image_public_id, d.image_alt, d.sort_order
  from public.gallery_images d
  where d.stage = 'draft'
  order by d.sort_order asc;
end;
$$;

revoke all on function public.publish_gallery_images_from_draft() from public;
grant execute on function public.publish_gallery_images_from_draft() to service_role;
