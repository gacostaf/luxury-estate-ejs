export interface PropertyGalleryImageDTO {
  id: number

  url: string

  alt?: string

  isFeatured?: boolean

  type?: 'image' | 'video'

  thumbnailUrl?: string
}