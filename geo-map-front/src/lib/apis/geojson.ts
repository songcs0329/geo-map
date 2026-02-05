import { AdminLevel, GeoJSONFeatureCollection } from "@/types/shared/geojson.types"
import restClient from "./restClient"

export const getGeoJSON = async (level: AdminLevel) => {
  const res = await restClient.get<GeoJSONFeatureCollection>(`/geojson`, { level })
  return res.data 
}