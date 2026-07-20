import { z } from "zod"

const uuid = z.string().uuid()

export const createGalleryImageSchema = z.object({
  image_url: z.string().url(),
  image_public_id: z.string().min(1).max(500).nullable().optional(),
  image_alt: z.string().max(300).default(""),
  sort_order: z.coerce.number().int().nonnegative().optional(),
})

export const updateGalleryImageSchema = z.object({
  image_url: z.string().url().optional(),
  image_public_id: z.string().min(1).max(500).nullable().optional(),
  image_alt: z.string().max(300).optional(),
  sort_order: z.coerce.number().int().nonnegative().optional(),
})

export const reorderGalleryImagesSchema = z.object({
  items: z.array(
    z.object({
      id: uuid,
      sort_order: z.coerce.number().int().nonnegative(),
    })
  ),
})

export const galleryImageIdParamsSchema = z.object({
  id: uuid,
})

export const updateGallerySettingsSchema = z.object({
  gallery_enabled: z.coerce.boolean(),
})
