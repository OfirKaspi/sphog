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

export async function deleteCatalogImage(publicId: string) {
  ensureCloudinaryConfigured()
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" })
}

export function extractCloudinaryPublicIdFromUrl(imageUrl: string): string | null {
  if (!imageUrl.includes("/upload/")) {
    return null
  }

  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./?]+)?(?:\?.*)?$/)
  return match?.[1] ?? null
}
