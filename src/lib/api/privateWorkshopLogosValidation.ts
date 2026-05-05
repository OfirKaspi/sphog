import { z } from "zod"

const uuid = z.string().uuid()

export const createPrivateWorkshopLogoSchema = z.object({
  image_url: z.string().url(),
  image_public_id: z.string().min(1).max(500).nullable().optional(),
  image_alt: z.string().max(300).default(""),
  sort_order: z.coerce.number().int().nonnegative().optional(),
})

export const updatePrivateWorkshopLogoSchema = z.object({
  image_url: z.string().url().optional(),
  image_public_id: z.string().min(1).max(500).nullable().optional(),
  image_alt: z.string().max(300).optional(),
  sort_order: z.coerce.number().int().nonnegative().optional(),
})

export const reorderPrivateWorkshopLogosSchema = z.object({
  items: z.array(
    z.object({
      id: uuid,
      sort_order: z.coerce.number().int().nonnegative(),
    })
  ),
})

export const privateWorkshopLogoIdParamsSchema = z.object({
  id: uuid,
})

export const updatePrivateWorkshopSettingsSchema = z.object({
  carousel_enabled: z.coerce.boolean(),
})
