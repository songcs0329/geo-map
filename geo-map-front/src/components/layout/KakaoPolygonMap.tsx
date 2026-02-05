"use client";

import { useCallback, useMemo } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useShallow } from "zustand/shallow";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useAdminGeoJSON from "@/hooks/map/useGetGeoJSON";
import { useKakaoPlacesSearch } from "@/hooks/place/useKakaoPlacesSearch";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import usePlaceSearchStore from "@/stores/usePlaceSearchStore";
import { KAKAO_MAP_CONFIG } from "@/lib/constants";
import {
  filterFeaturesByBounds,
  getAdminLevelByKakaoLevel,
} from "@/lib/kakaoGeoUtils";
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

  // 자동 장소 검색 훅 활성화
  useKakaoPlacesSearch();

  const { level, bounds, selectedFeature } = useKakaoMapStore(
    useShallow((state) => ({
      level: state.level,
      bounds: state.bounds,
      selectedFeature: state.selectedFeature,
    }))
  );

  const { setMap, setLevel, setBounds, toggleSelectedFeature } =
    useKakaoMapStore(
      useShallow((state) => ({
        setMap: state.setMap,
        setLevel: state.setLevel,
        setBounds: state.setBounds,
        toggleSelectedFeature: state.toggleSelectedFeature,
      }))
    );

  const { places, selectedPlace, setSelectedPlace } = usePlaceSearchStore(
    useShallow((state) => ({
      places: state.places,
      selectedPlace: state.selectedPlace,
      setSelectedPlace: state.setSelectedPlace,
    }))
  );

  const adminLevel = useMemo(() => getAdminLevelByKakaoLevel(level), [level]);

  const isSelected = (feature: GeoJSONFeature) => {
    if (!selectedFeature) return false;
    if (adminLevel === "sido") return false;
    return selectedFeature.properties.adm_cd === feature.properties.adm_cd;
  };

  const { data: geoJSON } = useAdminGeoJSON(adminLevel);

  const visibleFeatures = useMemo(() => {
    if (!geoJSON) return [];
    return filterFeaturesByBounds(geoJSON.features, bounds);
  }, [geoJSON, bounds]);

  const handlePolygonClick = useCallback(
    (feature: GeoJSONFeature) => {
      const { map, level } = useKakaoMapStore.getState();
      if (!map) return;

      const currentZoomLevel = map.getLevel();
      const currentAdminLevel = getAdminLevelByKakaoLevel(level);
      const centroid = calculateCentroid(feature);
      const latlng = new window.kakao.maps.LatLng(centroid.lat, centroid.lng);

      if (currentAdminLevel === "sgg") {
        toggleSelectedFeature(feature);
      }
      map.setLevel(currentZoomLevel - 1);
      map.panTo(latlng);
    },
    [toggleSelectedFeature]
  );

  if (loading || error) return null;

  return (
    <Map
      center={KAKAO_MAP_CONFIG.DEFAULT_CENTER}
      level={KAKAO_MAP_CONFIG.DEFAULT_LEVEL}
      style={{ width: "100%", height: "100vh" }}
      onCreate={(mapInstance) => {
        const { map } = useKakaoMapStore.getState();
        if (map) return;
        setMap(mapInstance);
        setBounds(mapInstance.getBounds());
      }}
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
          isSelected={isSelected(feature)}
          onSelect={handlePolygonClick}
        />
      ))}

      {/* 장소 검색 결과 마커 */}
      {places.map((place) => (
        <MapMarker
          key={place.id}
          position={{ lat: Number(place.y), lng: Number(place.x) }}
          onClick={() => setSelectedPlace(place)}
        />
      ))}

      {/* 선택된 장소 정보 오버레이 */}
      {selectedPlace && (
        <CustomOverlayMap
          position={{
            lat: Number(selectedPlace.y),
            lng: Number(selectedPlace.x),
          }}
          yAnchor={1.4}
        >
          <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 max-w-50">
            <p className="font-medium text-sm truncate">
              {selectedPlace.place_name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {selectedPlace.address_name}
            </p>
            {selectedPlace.phone && (
              <p className="text-xs text-gray-400">{selectedPlace.phone}</p>
            )}
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-600"
            >
              ✕
            </button>
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
}
