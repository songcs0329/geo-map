"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  AdminLevel,
  GeoJSONFeatureCollection,
} from "@/types/shared/geojson.types";
import { getGeoJSON } from "@/lib/apis/geojson";

/**
 * 행정구역 레벨에 따른 GeoJSON 데이터를 반환하는 훅
 *
 * - sido: 시/도 레벨 (17개)
 * - sgg: 시군구 레벨 (~250개)
 */
function useAdminGeoJSON(adminLevel: AdminLevel) {
  const { data, isLoading, error } = useQuery<GeoJSONFeatureCollection>({
    queryKey: ["geojson", adminLevel],
    queryFn: () => getGeoJSON(adminLevel),
    enabled: !!adminLevel,
  });

  return {
    data: data ?? null,
    isLoading,
    error,
  };
}

export default useAdminGeoJSON;
