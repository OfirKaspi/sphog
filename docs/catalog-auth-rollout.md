# Store + Catalog + Auth QA and Rollout

## QA checklist

- Responsive smoke checks completed on `/` and `/store` at `375`, `768`, and `1280` widths.
- Public navigation contains `חנות` in navbar/footer links.
- Home teaser "מעבר לחנות" CTA routes to `/store`.
- Unauthenticated access to admin APIs is blocked (`401` for `/api/admin/catalog/products` and `/api/admin/schedules`).
- Production build + lint pass in local environment.

## Admin auth and RBAC setup

1. Apply `supabase/migrations/20260216_catalog_auth.sql`.
2. Enable Supabase Email/Password auth provider.
3. Disable public signup (recommended).
4. Create/invite first admin user.
5. Insert admin role row:

```sql
insert into public.user_roles (user_id, role)
values ('<AUTH_USER_UUID>', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

## Staged rollout

### Wave 1: Visibility + UI

- Deploy nav/footer/sitemap visibility and shadcn card refactor.
- Monitor navigation and store page rendering.

### Wave 2: Public catalog reads

- Deploy Supabase-backed `store` + `home` catalog reads.
- Keep fallback product data enabled during stabilization.
- Monitor for empty/failed catalog responses.

### Wave 3: Admin auth + CRUD writes

- Deploy Supabase admin login, role checks, and catalog CRUD APIs/UI.
- Verify admin can create/update/delete and public site reflects active items.
- Deprecate legacy `/api/auth/login` consumers.
