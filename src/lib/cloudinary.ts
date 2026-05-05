import { v2 as cloudinary } from "cloudinary"

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

let configured = false

function ensureCloudinaryConfigured() {
  if (configured) {
    return
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Missing Cloudinary environment variables")
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  })

  configured = true
}

/** Cloudinary folder for private-workshop partner logos (existing assets live here). */
export const CLOUDINARY_LOGOS_FOLDER = "sphog/logos"

export async function uploadCatalogImage(buffer: Buffer, filename: string) {
  ensureCloudinaryConfigured()

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "sphog/products",
        resource_type: "image",
        overwrite: false,
        filename_override: filename,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"))
          return
        }

        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      }
    )

    stream.end(buffer)
  })
}

export async function uploadLogoImage(buffer: Buffer, filename: string) {
  ensureCloudinaryConfigured()

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_LOGOS_FOLDER,
        resource_type: "image",
        overwrite: false,
        filename_override: filename,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"))
          return
        }

        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      }
    )

    stream.end(buffer)
  })
}

type CloudinaryResourceListItem = {
  public_id: string
  secure_url: string
  resource_type?: string
}

/** List image resources under the logos folder (paginated). */
export async function listWorkshopLogoResources(): Promise<Array<{ public_id: string; secure_url: string }>> {
  ensureCloudinaryConfigured()

  const collected: Array<{ public_id: string; secure_url: string }> = []
  let next_cursor: string | undefined

  do {
    const result = (await cloudinary.api.resources({
      type: "upload",
      prefix: CLOUDINARY_LOGOS_FOLDER,
      max_results: 200,
      ...(next_cursor ? { next_cursor } : {}),
    })) as {
      resources?: CloudinaryResourceListItem[]
      next_cursor?: string
    }

    for (const resource of result.resources ?? []) {
      if (resource.resource_type && resource.resource_type !== "image") {
        continue
      }
      collected.push({ public_id: resource.public_id, secure_url: resource.secure_url })
    }

    next_cursor = result.next_cursor
  } while (next_cursor)

  return collected.sort((a, b) => a.public_id.localeCompare(b.public_id))
}

export async function deleteCatalogImage(publicId: string) {
  ensureCloudinaryConfigured()
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" })
}

/** Delete any Cloudinary image by public_id (same as catalog destroy). */
export async function deleteCloudinaryImage(publicId: string) {
  return deleteCatalogImage(publicId)
}

/** Decode/trim for comparing API public_id with values parsed from URLs. */
export function normalizeCloudinaryPublicId(id: string): string {
  try {
    return decodeURIComponent(id.trim())
  } catch {
    return id.trim()
  }
}

export function extractCloudinaryPublicIdFromUrl(imageUrl: string): string | null {
  if (!imageUrl.includes("/upload/")) {
    return null
  }

  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./?]+)?(?:\?.*)?$/)
  const captured = match?.[1]
  if (!captured) {
    return null
  }
  return normalizeCloudinaryPublicId(captured)
}
