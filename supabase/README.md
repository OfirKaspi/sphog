# Supabase Auth + RBAC Setup

## Required environment variables

Set these values in your deployment and local `.env` files:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Enable admin sign-in

1. In Supabase Auth providers, enable Email/Password.
2. Disable public sign-up (recommended for admin-only access).
3. Create or invite the first admin user in Supabase Auth.

## Provision admin role

Run this SQL after creating the first admin user:

```sql
insert into public.user_roles (user_id, role)
values ('<AUTH_USER_UUID>', 'admin')
on conflict (user_id) do update set role = excluded.role;
```
