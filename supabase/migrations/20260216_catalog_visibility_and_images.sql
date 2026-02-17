-- Catalog visibility flags + cloudinary image metadata

alter table public.catalog_products
  add column if not exists show_in_regular boolean not null default true,
  add column if not exists show_in_discount boolean not null default false,
  add column if not exists is_hidden boolean not null default false,
  add column if not exists image_public_id text;

-- Backfill explicit section assignment from legacy promo flag.
update public.catalog_products
set show_in_discount = coalesce(is_promo, false)
where show_in_discount is distinct from coalesce(is_promo, false);

drop policy if exists "public_read_active_products" on public.catalog_products;
create policy "public_read_active_products"
on public.catalog_products
for select
using (is_active = true and is_hidden = false);

create index if not exists idx_catalog_products_regular
  on public.catalog_products (show_in_regular)
  where is_active = true and is_hidden = false;

create index if not exists idx_catalog_products_discount
  on public.catalog_products (show_in_discount)
  where is_active = true and is_hidden = false;
