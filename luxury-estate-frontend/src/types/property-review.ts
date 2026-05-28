export interface PropertyReviewDTO {
  id: number

  reviewerName: string

  reviewerAvatarUrl?: string

  rating: number

  title?: string

  comment: string

  createdAt: string

  verified?: boolean
}

export interface PropertyReviewsSectionDTO {
  averageRating: number

  totalReviews: number

  reviews: PropertyReviewDTO[]
}
