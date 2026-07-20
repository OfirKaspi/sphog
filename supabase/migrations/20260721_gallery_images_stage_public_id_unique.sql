-- Prevent duplicate Cloudinary assets per stage (also hardens concurrent draft seed races).
create unique index if not exists gallery_images_stage_public_id_uidx
  on public.gallery_images (stage, image_public_id)
  where image_public_id is not null;
