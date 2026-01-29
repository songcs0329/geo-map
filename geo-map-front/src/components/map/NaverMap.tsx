"use client";

import { useNaverMap } from "@/hooks/useNaverMap";

interface NaverMapProps {
  width?: string;
  height?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  className?: string;
}

export function NaverMap({
  width = "100%",
  height = "400px",
  initialCenter,
  initialZoom,
  className,
}: NaverMapProps) {
  const { mapRef } = useNaverMap<HTMLDivElement>({
    center: initialCenter,
    zoom: initialZoom,
  });

  return <div ref={mapRef} className={className} style={{ width, height }} />;
}
