"use client";

import useMapStore from "@/stores/useMapStore";
import { GeoJSONFeature } from "@/types/map";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

/**
 * 다각형의 중심점(centroid) 계산
 */
export function calculateCentroid(feature: GeoJSONFeature): {
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

interface UseNaverMapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
}

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

function useNaverMap<T extends HTMLElement>(options: UseNaverMapOptions = {}) {
  const { center: defaultCenter = { lat: 37.5665, lng: 126.978 }, zoom: defaultZoom = 14 } = options;
  const mapRef = useRef<T>(null);
  const setMapInstance = useMapStore((state) => state.setMapInstance);
  const searchParams = useSearchParams();

  // URL searchParams에서 값이 있으면 사용, 없으면 기본값
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const zoomParam = searchParams.get("zoom");

  const center = lat && lng
    ? { lat: parseFloat(lat), lng: parseFloat(lng) }
    : defaultCenter;
  const zoom = zoomParam ? parseInt(zoomParam, 10) : defaultZoom;

  // 초기값을 ref로 캡처 (이후 URL 변경 시 재초기화 방지)
  const initialOptionsRef = useRef({ center, zoom });

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID || !mapRef.current) return;

    const { center: initialCenter, zoom: initialZoom } = initialOptionsRef.current;

    const initializeMap = () => {
      if (!mapRef.current) return;

      const instance = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: initialZoom,
        minZoom: 12,
      });

      setMapInstance(instance);
    };

    if (window.naver?.maps) {
      initializeMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }

    // cleanup: 컴포넌트 unmount 시 mapInstance 정리
    return () => {
      setMapInstance(null);
    };
  }, [setMapInstance]);

  return mapRef;
}

export default useNaverMap;