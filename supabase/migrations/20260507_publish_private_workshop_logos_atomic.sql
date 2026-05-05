-- Replace published workshop logos from draft in one transaction (invoked via RPC from the app).

create or replace function public.publish_private_workshop_logos_from_draft()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.private_workshop_logos where stage = 'published';
  insert into public.private_workshop_logos (stage, image_url, image_public_id, image_alt, sort_order)
  select 'published'::text, d.image_url, d.image_public_id, d.image_alt, d.sort_order
  from public.private_workshop_logos d
  where d.stage = 'draft'
  order by d.sort_order asc;
end;
$$;

revoke all on function public.publish_private_workshop_logos_from_draft() from public;
grant execute on function public.publish_private_workshop_logos_from_draft() to service_role;
