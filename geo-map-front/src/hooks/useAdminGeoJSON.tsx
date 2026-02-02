"use client";

import { useMemo } from "react";
import type { AdminLevel, GeoJSONFeatureCollection } from "@/types/map";

// Static imports (loaded at build time)
import sidoData from "@/data/sido.json";
import sggData from "@/data/sgg.json";
import dongData from "@/data/dong.json";

/**
 * 행정구역 레벨에 따른 GeoJSON 데이터를 반환하는 훅
 *
 * - sido: 시/도 레벨 (17개)
 * - sgg: 시군구 레벨 (~250개)
 * - dong: 동 레벨 (~3,500개)
 */
function useAdminGeoJSON(adminLevel: AdminLevel) {
  const data = useMemo(() => {
    switch (adminLevel) {
      case "sido":
        return sidoData as GeoJSONFeatureCollection;
      case "sgg":
        return sggData as GeoJSONFeatureCollection;
      case "dong":
        return dongData as GeoJSONFeatureCollection;
      default:
        return sidoData as GeoJSONFeatureCollection;
    }
  }, [adminLevel]);

  return {
    data,
    featureCount: data.features.length,
  };
}

export default useAdminGeoJSON;
