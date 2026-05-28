export interface NearbyPlaceDTO {
  id: number

  name: string

  category: string

  distance?: string
}

export interface PropertyMapSectionDTO {
  latitude: number

  longitude: number

  title: string

  address?: string

  nearbyPlaces?: NearbyPlaceDTO[]
}
