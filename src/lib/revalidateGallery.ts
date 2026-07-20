import { revalidatePath } from "next/cache"

/** Bust Next.js cache for the gallery page and site layout (nav link visibility). */
export function revalidateGalleryPaths(): boolean {
  try {
    revalidatePath("/gallery", "page")
    revalidatePath("/", "layout")
    return true
  } catch (error) {
    console.error("Failed to revalidate gallery paths:", error)
    return false
  }
}
