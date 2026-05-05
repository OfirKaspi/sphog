-- Private workshop logos (draft + published snapshots) with Cloudinary metadata

create table if not exists public.private_workshop_logos (
  id uuid primary key default gen_random_uuid(),
  stage text not null check (stage in ('draft', 'published')),
  image_url text not null,
  image_public_id text,
  image_alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_private_workshop_logos_stage_sort
  on public.private_workshop_logos (stage, sort_order asc);

drop trigger if exists trg_private_workshop_logos_updated_at on public.private_workshop_logos;
create trigger trg_private_workshop_logos_updated_at
before update on public.private_workshop_logos
for each row execute function public.set_updated_at();

alter table public.private_workshop_logos enable row level security;

drop policy if exists "public_read_published_workshop_logos" on public.private_workshop_logos;
create policy "public_read_published_workshop_logos"
on public.private_workshop_logos
for select
using (stage = 'published');

drop policy if exists "admin_all_workshop_logos" on public.private_workshop_logos;
create policy "admin_all_workshop_logos"
on public.private_workshop_logos
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
