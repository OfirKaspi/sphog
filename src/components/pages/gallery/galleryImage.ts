export type GalleryGridItem = {
  id: string
  src: string
  alt: string
}

export function galleryOptimizedSrc(src: string, width = 900): string {
  if (!src.includes("cloudinary.com") || !src.includes("/upload/")) {
    return src
  }

  const publicIdMatch = src.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./?]+)?(?:\?.*)?$/)
  if (!publicIdMatch?.[1]) {
    return src
  }

  const publicId = publicIdMatch[1]
  return `https://res.cloudinary.com/dudwjf2pu/image/upload/w_${width},c_limit,f_auto,q_auto/${publicId}`
}
