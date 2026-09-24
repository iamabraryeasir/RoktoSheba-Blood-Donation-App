export interface HospitalPlace {
  id: string;
  name: string;
  displayName: string;
  division: string;
  district: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  isBloodBank: boolean;
  phone?: string;
  type?: string;
}

export interface NominatimRawAddress {
  hospital?: string;
  clinic?: string;
  amenity?: string;
  building?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  city?: string;
  town?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface NominatimRawResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address?: NominatimRawAddress;
}
