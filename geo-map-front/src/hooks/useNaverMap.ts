"use client";

import { useEffect, useRef } from "react";

interface UseNaverMapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
}

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

export function useNaverMap<T extends HTMLElement>(options: UseNaverMapOptions = {}) {
  const { center = { lat: 37.5665, lng: 126.978 }, zoom = 14 } = options;
  const mapRef = useRef<T>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID || !mapRef.current) return;

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom,
      });
    };

    if (window.naver?.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
    script.onload = initializeMap;
    document.head.appendChild(script);
  }, [center.lat, center.lng, zoom]);

  return { mapRef, mapInstanceRef };
}
