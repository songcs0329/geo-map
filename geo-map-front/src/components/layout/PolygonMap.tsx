"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import useMapPolygon from "@/hooks/useMapPolygon";
import useNaverMap, { calculateCentroid } from "@/hooks/useNaverMap";
import useMapBounds from "@/hooks/useMapBounds";
import useAdminGeoJSON from "@/hooks/useAdminGeoJSON";
import { MAP_CONFIG, ZOOM_LEVELS } from "@/lib/constants";
import type { GeoJSONFeature } from "@/types/map";
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

  // 클릭 핸들러: 동 레벨이면 라우터 이동, 아니면 줌인
  const handleClick = useCallback(
    (feature: GeoJSONFeature) => {
      if (!mapInstance) return;

      const centroid = calculateCentroid(feature);
      const latlng = new window.naver.maps.LatLng(centroid.lat, centroid.lng);

      // 동 레벨일 때만 라우터 이동
      if (adminLevel === "dong") {
        mapInstance.panTo(latlng, { duration: 600 });
        const searchParams = new URLSearchParams({
          lat: centroid.lat.toString(),
          lng: centroid.lng.toString(),
          zoom: mapInstance.getZoom().toString(),
        });
        router.push(
          `/search/${feature.properties.adm_cd}?${searchParams.toString()}`
        );
      } else {
        // sido/sgg 레벨이면 다음 레벨로 줌인
        const nextZoom =
          adminLevel === "sido" ? ZOOM_LEVELS.SGG.min : ZOOM_LEVELS.DONG.min;
        mapInstance.morph(latlng, nextZoom, { duration: 600 });
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
