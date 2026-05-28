export interface PropertyHighlightDTO {
  id: number

  label: string

  value: string
}

export interface PropertyFactDTO {
  id: number

  label: string

  value: string
}

export interface PropertyDescriptionSectionDTO {
  title: string

  shortDescription?: string

  fullDescription?: string

  highlights?: PropertyHighlightDTO[]

  facts?: PropertyFactDTO[]
}