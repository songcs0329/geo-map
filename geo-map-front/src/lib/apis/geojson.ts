import { AdminLevel, GeoJSONFeature, GeoJSONFeatureCollection } from "@/types/shared/geojson.types"
import restClient from "./restClient"

export const getGeoJSON = async (level: AdminLevel) => {
  const res = await restClient.get<GeoJSONFeatureCollection>(`/geojson`, { level })
  return res.data 
}

export const getGeoJSONRegionByAdmCd = async (adm_cd: string) => {
  const res = await restClient.get<GeoJSONFeature>(`/geojson/region/${adm_cd}`)
  return res.data
}

export const geGeoJSONResgionSearch = async (regionName: string, level?: AdminLevel) => {
  const res = await restClient.get<GeoJSONFeature>(`/geojson/search`, { regionName, level })
  return res.data
}