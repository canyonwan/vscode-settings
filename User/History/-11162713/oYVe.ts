interface RootObject {
  info: string
  regeocode: Regeocode
}

interface Regeocode {
  addressComponent: AddressComponent
  formattedAddress: string
  roads: any[]
  crosses: any[]
  pois: any[]
}

interface AddressComponent {
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

interface BusinessArea {
  name: string
  id: string
  location: number[]
}
