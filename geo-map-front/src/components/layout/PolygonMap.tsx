"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import useMapPolygon from "@/hooks/useMapPolygon";
import useNaverMap, { calculateCentroid } from "@/hooks/useNaverMap";
import { MAP_CONFIG } from "@/lib/constants";
import type { GeoJSONFeatureCollection, GeoJSONFeature } from "@/types/map";

// Import Seoul dong-level GeoJSON data
import seoulData from "@/data/seoul-dong.json";
import useMapStore from "@/stores/useMapStore";

export function PolygonMap() {
  const router = useRouter();

  // Zustand store
  const mapInstance = useMapStore((state) => state.mapInstance);

  // Use Seoul dong data
  const geoJSON = seoulData as GeoJSONFeatureCollection;

  // useNaverMap 내부에서 searchParams를 확인하여 center/zoom 결정
  const mapRef = useNaverMap<HTMLDivElement>({
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
  });

  // 클릭 핸들러: 지도 중심 이동 + 라우터 이동
  const handleClick = useCallback(
    (feature: GeoJSONFeature) => {
      if (!mapInstance) return;

      // 클릭한 폴리곤의 중심으로 지도 이동
      const centroid = calculateCentroid(feature);
      const latlng = new window.naver.maps.LatLng(centroid.lat, centroid.lng);
      mapInstance.panTo(latlng, { duration: 300 });

      // 다이나믹 라우트로 이동
      const searchParams = new URLSearchParams({
        lat: centroid.lat.toString(),
        lng: centroid.lng.toString(),
        zoom: mapInstance.getZoom().toString(),
      });
      router.push(
        `/search/${feature.properties.adm_cd}?${searchParams.toString()}`
      );
    },
    [mapInstance, router]
  );

  // Setup polygons with events
  useMapPolygon({
    map: mapInstance,
    geoJSON,
    onClick: handleClick,
  });

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
