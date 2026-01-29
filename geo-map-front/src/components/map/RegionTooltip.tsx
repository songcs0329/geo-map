"use client";

import { useEffect, useReducer, useMemo } from "react";
import { useMapStore } from "@/stores/mapStore";
import { Card, CardContent } from "@/components/ui/card";
import type { GeoJSONFeature } from "@/types/map";

interface RegionTooltipProps {
  mapInstance: naver.maps.Map | null;
}

/**
 * 다각형의 중심점(centroid) 계산
 */
function calculateCentroid(feature: GeoJSONFeature): {
  lat: number;
  lng: number;
} {
  const { geometry } = feature;
  let sumLat = 0;
  let sumLng = 0;
  let count = 0;

  const processRing = (ring: number[][]) => {
    for (const [lng, lat] of ring) {
      sumLng += lng;
      sumLat += lat;
      count++;
    }
  };

  if (geometry.type === "Polygon") {
    const coordinates = geometry.coordinates as number[][][];
    if (coordinates[0]) {
      processRing(coordinates[0]);
    }
  } else if (geometry.type === "MultiPolygon") {
    const coordinates = geometry.coordinates as number[][][][];
    for (const polygon of coordinates) {
      if (polygon[0]) {
        processRing(polygon[0]);
      }
    }
  }

  return {
    lat: count > 0 ? sumLat / count : 0,
    lng: count > 0 ? sumLng / count : 0,
  };
}

/**
 * 지도 좌표를 화면 좌표로 변환
 */
function getScreenPosition(
  mapInstance: naver.maps.Map,
  feature: GeoJSONFeature
): { x: number; y: number } {
  const centroid = calculateCentroid(feature);
  const coord = new window.naver.maps.LatLng(centroid.lat, centroid.lng);
  const projection = mapInstance.getProjection();
  const point = projection.fromCoordToOffset(coord);
  return { x: point.x, y: point.y };
}

export function RegionTooltip({ mapInstance }: RegionTooltipProps) {
  const selectedRegion = useMapStore((state) => state.selectedRegion);
  const clearSelection = useMapStore((state) => state.clearSelection);
  const [updateKey, forceUpdate] = useReducer((x) => x + 1, 0);

  // 위치 계산 (렌더링 중에 동기적으로)
  const position = useMemo(() => {
    if (!mapInstance || !selectedRegion) return null;
    return getScreenPosition(mapInstance, selectedRegion);
  }, [mapInstance, selectedRegion, updateKey]);

  // 지도 이동/줌 시 위치 업데이트 구독
  useEffect(() => {
    if (!mapInstance || !selectedRegion) return;

    const updatePosition = () => {
      forceUpdate();
    };

    const listeners = [
      naver.maps.Event.addListener(mapInstance, "zoom_changed", updatePosition),
      naver.maps.Event.addListener(
        mapInstance,
        "center_changed",
        updatePosition
      ),
    ];

    return () => {
      listeners.forEach((listener) =>
        naver.maps.Event.removeListener(listener)
      );
    };
  }, [mapInstance, selectedRegion]);

  if (!selectedRegion || !position) return null;

  const { properties } = selectedRegion;

  return (
    <div
      className="pointer-events-auto absolute z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <Card className="bg-white/95 shadow-lg backdrop-blur-sm">
        <CardContent className="flex flex-col items-start space-y-2">
          <button
            onClick={clearSelection}
            className="flex h-5 w-5 items-center justify-center self-end rounded-full bg-gray-800 text-xs text-white transition-colors hover:bg-gray-700"
            aria-label="닫기"
          >
            ×
          </button>
          <p className="text-sm font-semibold text-gray-900">
            {properties.adm_nm}
          </p>
          <p className="text-xs text-gray-600">{properties.sggnm}</p>
          <p className="mt-1 text-xs text-gray-500">
            코드: {properties.adm_cd}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
