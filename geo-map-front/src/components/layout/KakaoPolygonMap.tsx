"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useAdminGeoJSON from "@/hooks/map/useGetGeoJSON";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import { KAKAO_MAP_CONFIG, KAKAO_ZOOM_LEVELS } from "@/lib/constants";
import { filterFeaturesByBounds } from "@/lib/kakaoGeoUtils";
import PolygonLayer from "./PolygonLayer";
import type { GeoJSONFeature } from "@/types/shared/geojson.types";

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

export default function KakaoPolygonMap() {
  const { loading, error } = useKakaoLoader();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    map,
    bounds,
    selectedFeatureId,
    setMap,
    setLevel,
    setBounds,
    toggleSelectedFeatureId,
    getAdminLevel,
  } = useKakaoMapStore();

  const adminLevel = getAdminLevel();

  const initialCenter = useMemo(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
    return KAKAO_MAP_CONFIG.DEFAULT_CENTER;
  }, [searchParams]);

  const initialLevel = useMemo(() => {
    const zoom = searchParams.get("zoom");
    if (zoom) {
      return Math.max(1, Math.min(14, 21 - parseInt(zoom, 10)));
    }
    return KAKAO_MAP_CONFIG.DEFAULT_LEVEL;
  }, [searchParams]);

  const { data: geoJSON } = useAdminGeoJSON(adminLevel);

  const visibleFeatures = useMemo(() => {
    if (!geoJSON) return [];
    return filterFeaturesByBounds(geoJSON.features, bounds);
  }, [geoJSON, bounds]);

  const handlePolygonClick = useCallback(
    (feature: GeoJSONFeature) => {
      if (!map) return;
      const centroid = calculateCentroid(feature);
      const latlng = new window.kakao.maps.LatLng(centroid.lat, centroid.lng);

      toggleSelectedFeatureId(feature.properties.adm_cd);

      if (adminLevel === "dong") {
        map.panTo(latlng);
        const currentLevel = map.getLevel();
        const approximateZoom = 21 - currentLevel;
        const params = new URLSearchParams({
          lat: centroid.lat.toString(),
          lng: centroid.lng.toString(),
          zoom: approximateZoom.toString(),
        });
        router.push(
          `/search/${feature.properties.adm_cd}?${params.toString()}`
        );
      } else {
        const nextLevel =
          adminLevel === "sido"
            ? KAKAO_ZOOM_LEVELS.SGG.max
            : KAKAO_ZOOM_LEVELS.DONG.max;
        map.panTo(latlng);
        map.setLevel(nextLevel);
      }
    },
    [map, adminLevel, router, toggleSelectedFeatureId]
  );

  if (loading || error) return null;

  return (
    <Map
      center={initialCenter}
      level={initialLevel}
      style={{ width: "100%", height: "100vh" }}
      onCreate={setMap}
      onZoomChanged={(map) => {
        setLevel(map.getLevel());
        setBounds(map.getBounds());
      }}
      onBoundsChanged={(map) => {
        setBounds(map.getBounds());
      }}
    >
      {visibleFeatures.map((feature) => (
        <PolygonLayer
          key={feature.properties.adm_cd}
          feature={feature}
          adminLevel={adminLevel}
          isSelected={selectedFeatureId === feature.properties.adm_cd}
          onSelect={handlePolygonClick}
        />
      ))}
    </Map>
  );
}
