-- Catalog + RBAC schema migration
-- Apply in Supabase SQL editor or migration tooling.

create extension if not exists "pgcrypto";

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) check (original_price is null or original_price >= price),
  currency text not null default 'ILS',
  image_url text not null,
  image_alt text not null default '',
  in_stock boolean not null default true,
  is_promo boolean not null default false,
  show_on_home boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_catalog_products_active
  on public.catalog_products (is_active);

create index if not exists idx_catalog_products_home
  on public.catalog_products (show_on_home)
  where is_active = true;

create index if not exists idx_catalog_products_sort
  on public.catalog_products (sort_order, created_at desc);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_catalog_products_updated_at on public.catalog_products;
create trigger trg_catalog_products_updated_at
before update on public.catalog_products
for each row execute function public.set_updated_at();

alter table public.catalog_products enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = uid
      and ur.role = 'admin'
  );
$$;

drop policy if exists "public_read_active_products" on public.catalog_products;
create policy "public_read_active_products"
on public.catalog_products
for select
using (is_active = true);

drop policy if exists "admin_insert_products" on public.catalog_products;
create policy "admin_insert_products"
on public.catalog_products
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "admin_update_products" on public.catalog_products;
create policy "admin_update_products"
on public.catalog_products
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admin_delete_products" on public.catalog_products;
create policy "admin_delete_products"
on public.catalog_products
for delete
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "admin_read_user_roles" on public.user_roles;
create policy "admin_read_user_roles"
on public.user_roles
for select
to authenticated
using (public.is_admin(auth.uid()));
