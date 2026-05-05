-- Singleton settings for private workshop logos section (carousel visibility on public site)

create table if not exists public.private_workshop_settings (
  id text primary key default 'default' check (id = 'default'),
  carousel_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.private_workshop_settings (id)
values ('default')
on conflict (id) do nothing;

drop trigger if exists trg_private_workshop_settings_updated_at on public.private_workshop_settings;
create trigger trg_private_workshop_settings_updated_at
before update on public.private_workshop_settings
for each row execute function public.set_updated_at();

alter table public.private_workshop_settings enable row level security;

drop policy if exists "public_read_private_workshop_settings" on public.private_workshop_settings;
create policy "public_read_private_workshop_settings"
on public.private_workshop_settings
for select
using (true);

drop policy if exists "admin_all_private_workshop_settings" on public.private_workshop_settings;
create policy "admin_all_private_workshop_settings"
on public.private_workshop_settings
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
