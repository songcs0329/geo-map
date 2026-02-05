"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import useMapPolygon from "@/hooks/map/useMapPolygon";
import useNaverMap, { calculateCentroid } from "@/hooks/map/useNaverMap";
import useMapBounds from "@/hooks/map/useMapBounds";
import useAdminGeoJSON from "@/hooks/map/useGetGeoJSON";
import { MAP_CONFIG, ZOOM_LEVELS } from "@/lib/constants";
import type { GeoJSONFeature } from "@/types/shared/geojson.types";
import useMapStore from "@/stores/useMapStore";

export default function PolygonMap() {
  const router = useRouter();

  // Zustand store
  const mapInstance = useMapStore((state) => state.mapInstance);

  // 지도 bounds/zoom 상태 추적
  const { bounds, adminLevel } = useMapBounds(mapInstance);

  // 행정 레벨에 따른 GeoJSON 데이터 로드
  const { data: geoJSON } = useAdminGeoJSON(adminLevel);

  // useNaverMap 내부에서 searchParams를 확인하여 center/zoom 결정
  const mapRef = useNaverMap<HTMLDivElement>({
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
  });

  // 클릭 핸들러: sgg 레벨이면 라우터 이동, sido면 줌인
  const handleClick = useCallback(
    (feature: GeoJSONFeature) => {
      if (!mapInstance) return;

      const centroid = calculateCentroid(feature);
      const latlng = new window.naver.maps.LatLng(centroid.lat, centroid.lng);

      if (adminLevel === "sido") {
        // 시/도 레벨이면 시군구 레벨로 줌인
        mapInstance.morph(latlng, ZOOM_LEVELS.SGG.min, { duration: 600 });
      } else {
        // 시군구 레벨이면 검색 페이지로 이동
        mapInstance.panTo(latlng, { duration: 600 });
        const searchParams = new URLSearchParams({
          lat: centroid.lat.toString(),
          lng: centroid.lng.toString(),
          zoom: mapInstance.getZoom().toString(),
        });
        router.push(
          `/search/${feature.properties.adm_cd}?${searchParams.toString()}`
        );
      }
    },
    [mapInstance, router, adminLevel]
  );

  // Setup polygons with events (bounds 기반 필터링)
  useMapPolygon({
    map: mapInstance,
    geoJSON,
    bounds,
    adminLevel,
    onClick: handleClick,
  });

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
