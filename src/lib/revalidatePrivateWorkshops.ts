import { revalidatePath } from "next/cache"

/** Bust Next.js cache for the private workshops page after logo publish or settings changes. */
export function revalidatePrivateWorkshopsPage(): boolean {
  try {
    revalidatePath("/private-workshops", "page")
    return true
  } catch (error) {
    console.error("Failed to revalidate /private-workshops:", error)
    return false
  }
}
