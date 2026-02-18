import { z } from "zod"

function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

const cleanedString = (min: number, max: number) =>
  z.string().min(min).max(max).transform(sanitizeText)
const cleanedOptionalString = (max: number) => z.string().max(max).transform(sanitizeText)

const galleryImageSchema = z.object({
  url: z.string().url(),
  public_id: z.string(),
})

const catalogProductBaseSchema = z.object({
  slug: cleanedString(2, 120),
  name: cleanedString(2, 200),
  description: cleanedOptionalString(4000).default(""),
  price: z.coerce.number().nonnegative(),
  original_price: z.coerce.number().nonnegative().nullable().optional(),
  currency: cleanedOptionalString(10).default("ILS"),
  image_url: z.string().url(),
  image_public_id: cleanedOptionalString(500).nullable().optional(),
  image_alt: cleanedOptionalString(300).default(""),
  gallery_images: z.array(galleryImageSchema).nullable().optional(),
  in_stock: z.coerce.boolean().default(true),
  is_promo: z.coerce.boolean().default(false),
  show_on_home: z.coerce.boolean().default(false),
  show_in_regular: z.coerce.boolean().default(true),
  show_in_discount: z.coerce.boolean().default(false),
  is_hidden: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
})

export const catalogProductSchema = catalogProductBaseSchema.superRefine((value, ctx) => {
    if (value.original_price !== undefined && value.original_price !== null && value.original_price < value.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "original_price must be greater than or equal to price",
        path: ["original_price"],
      })
    }
  })

export const createCatalogProductSchema = catalogProductSchema
export const updateCatalogProductSchema = catalogProductBaseSchema.partial().superRefine((value, ctx) => {
  if (
    value.original_price !== undefined &&
    value.original_price !== null &&
    value.price !== undefined &&
    value.original_price < value.price
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "original_price must be greater than or equal to price",
      path: ["original_price"],
    })
  }
})
