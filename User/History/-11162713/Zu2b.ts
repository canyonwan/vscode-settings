export interface IMapAddress {
  info: string
  regeocode: IReGeocode
}

export interface IReGeocode {
  addressComponent: AddressComponent
  formattedAddress: string
  roads: any[]
  crosses: any[]
  pois: any[]
}

export interface AddressComponent {
  citycode: string
  adcode: string
  businessAreas: BusinessArea[]
  neighborhoodType: string
  neighborhood: string
  building: string
  buildingType: string
  street: string
  streetNumber: string
  province: string
  city: string
  district: string
  township: string
}

export interface BusinessArea {
  name: string
  id: string
  location: number[]
}
