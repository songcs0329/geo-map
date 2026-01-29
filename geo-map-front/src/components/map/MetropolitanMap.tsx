"use client";

import { useEffect, useState, useCallback } from "react";
import { useNaverMap } from "@/hooks/useNaverMap";
import { useMapPolygon } from "@/hooks/useMapPolygon";
import { useMapStore } from "@/stores/mapStore";
import { RegionTooltip } from "./RegionTooltip";
import { MAP_CONFIG } from "@/lib/constants";
import type { GeoJSONFeatureCollection, GeoJSONFeature } from "@/types/map";

// Import Seoul dong-level GeoJSON data
import seoulData from "@/data/seoul-dong.json";

export function MetropolitanMap() {
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);

  // Zustand store
  const setHoveredRegion = useMapStore((state) => state.setHoveredRegion);
  const setSelectedRegion = useMapStore((state) => state.setSelectedRegion);

  // Use Seoul dong data
  const geoJSON = seoulData as GeoJSONFeatureCollection;

  // Initialize map centered on Seoul
  const { mapRef, mapInstanceRef } = useNaverMap<HTMLDivElement>({
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
  });

  // Track map instance via state
  useEffect(() => {
    const checkMapInstance = () => {
      if (mapInstanceRef.current && !mapInstance) {
        setMapInstance(mapInstanceRef.current);
      }
    };

    checkMapInstance();
    const interval = setInterval(checkMapInstance, 100);

    return () => clearInterval(interval);
  }, [mapInstanceRef, mapInstance]);

  // Event handlers for polygons
  const handleMouseOver = useCallback(
    (feature: GeoJSONFeature) => {
      setHoveredRegion(feature);
    },
    [setHoveredRegion]
  );

  const handleMouseOut = useCallback(() => {
    setHoveredRegion(null);
  }, [setHoveredRegion]);

  const handleClick = useCallback(
    (feature: GeoJSONFeature) => {
      setSelectedRegion(feature);
    },
    [setSelectedRegion]
  );

  // Setup polygons with events
  useMapPolygon({
    map: mapInstance,
    geoJSON,
    eventHandlers: {
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      onClick: handleClick,
    },
    enableHover: true,
    enableClick: true,
  });

  return (
    <div className="relative">
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />

      {/* Region tooltip at centroid */}
      <RegionTooltip mapInstance={mapInstance} />
    </div>
  );
}
