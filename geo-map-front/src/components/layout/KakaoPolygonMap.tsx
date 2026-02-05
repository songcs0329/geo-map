"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useShallow } from "zustand/shallow";
import { MapPin, Phone, ExternalLink, X } from "lucide-react";
import useKakaoLoader from "@/hooks/kakao/useKakaoLoader";
import useInitSearchParamsMapOptions from "@/hooks/kakao/useInitSearchParamsMapOptions";
import useAdminGeoJSON from "@/hooks/map/useGetGeoJSON";
import useGetKakaoPlacesSearch from "@/hooks/kakao/useGetKakaoPlacesSearch";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import usePlaceSearchStore from "@/stores/usePlaceSearchStore";
import {
  filterFeaturesByBounds,
  getAdminLevelByKakaoLevel,
} from "@/lib/kakaoGeoUtils";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import PolygonLayer from "./PolygonLayer";
import type { GeoJSONFeature } from "@/types/shared/geojson.types";

/**
 * 폴리곤의 중심점(centroid) 계산
 * - Polygon 또는 MultiPolygon 지오메트리의 평균 좌표 반환
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
 * KakaoPolygonMap
 *
 * 역할: 카카오 지도 + 행정구역 폴리곤 + 장소 마커 표시 컴포넌트
 *
 * 주요 기능:
 * 1. 행정구역 폴리곤 렌더링 (줌 레벨에 따라 시/도 또는 시군구)
 * 2. 폴리곤 클릭 시 해당 지역 검색 (router.push로 searchParams 업데이트)
 * 3. 장소 검색 결과 마커 표시
 * 4. 마커 클릭 시 장소 정보 오버레이 표시
 *
 * 줌 레벨 동작:
 * - 시/도 레벨(10~12): 클릭 시 확대만 (검색 X)
 * - 시군구 레벨(7~9): 클릭 시 해당 지역명으로 검색 시작
 */
export default function KakaoPolygonMap() {
  const router = useRouter();

  const { loading, error } = useKakaoLoader();

  // 초기 지도 옵션 (searchParams에서 최초 마운트 시에만 읽음)
  const { mapCenter, mapLevel } = useInitSearchParamsMapOptions();

  // 장소 검색 결과 (searchParams 기반)
  const { places } = useGetKakaoPlacesSearch();

  // 지도 상태
  const { level, bounds } = useKakaoMapStore(
    useShallow((state) => ({
      level: state.level,
      bounds: state.bounds,
    }))
  );

  // 지도 액션
  const { setMap, setLevel, setBounds } = useKakaoMapStore(
    useShallow((state) => ({
      setMap: state.setMap,
      setLevel: state.setLevel,
      setBounds: state.setBounds,
    }))
  );

  // 선택된 장소 상태 (마커 오버레이용)
  const { selectedPlace, setSelectedPlace } = usePlaceSearchStore(
    useShallow((state) => ({
      selectedPlace: state.selectedPlace,
      setSelectedPlace: state.setSelectedPlace,
    }))
  );

  // 현재 줌 레벨에 따른 행정구역 레벨 (sido 또는 sgg)
  // - 초기 렌더링: mapLevel (searchParams에서 가져온 초기값)
  // - 지도 조작 후: store의 level (onZoomChanged에서 업데이트)
  const currentLevel = level ?? mapLevel;
  const adminLevel = useMemo(
    () => getAdminLevelByKakaoLevel(currentLevel),
    [currentLevel]
  );

  // 행정구역 GeoJSON 데이터
  const { data: geoJSON } = useAdminGeoJSON(adminLevel);

  // 현재 화면에 보이는 폴리곤만 필터링 (성능 최적화)
  const visibleFeatures = useMemo(() => {
    if (!geoJSON) return [];
    return filterFeaturesByBounds(geoJSON.features, bounds);
  }, [geoJSON, bounds]);

  /**
   * 폴리곤 클릭 핸들러
   * - 시/도 레벨: 확대만
   * - 시군구 레벨: 지역명으로 검색 시작 (router.push)
   */
  const handlePolygonClick = useCallback(
    (feature: GeoJSONFeature) => {
      const { map } = useKakaoMapStore.getState();
      if (!map) return;

      const currentZoomLevel = map.getLevel();
      const currentAdminLevel = getAdminLevelByKakaoLevel(currentZoomLevel);
      const centroid = calculateCentroid(feature);
      const latlng = new window.kakao.maps.LatLng(centroid.lat, centroid.lng);

      // 시군구 레벨에서 클릭하면 검색 시작
      if (currentAdminLevel === "sgg") {
        // 지역명에서 마지막 단어 추출 (예: "서울특별시 마포구" -> "마포구")
        const keyword = feature.properties.adm_nm.split(" ").at(-1);
        if (keyword) {
          // 지도 중심 좌표와 함께 검색 파라미터 설정
          const center = map.getCenter();
          const params = new URLSearchParams();
          params.set("query", keyword);
          params.set("level", String(currentZoomLevel));
          params.set("x", String(center.getLng()));
          params.set("y", String(center.getLat()));

          router.push(`/?${params.toString()}`);
        }
      }

      // 확대 및 이동
      map.setLevel(currentZoomLevel - 1);
      map.panTo(latlng);
    },
    [router]
  );

  // 로딩 또는 에러 시 렌더링 안 함
  if (loading || error) return null;

  return (
    <Map
      center={mapCenter}
      level={mapLevel}
      style={{ width: "100%", height: "100vh" }}
      onCreate={(mapInstance) => {
        const { map } = useKakaoMapStore.getState();
        if (map) return;
        setMap(mapInstance);
        setLevel(mapInstance.getLevel());
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
      {/* 행정구역 폴리곤 레이어 */}
      {visibleFeatures.map((feature) => (
        <PolygonLayer
          key={feature.properties.adm_cd}
          feature={feature}
          adminLevel={adminLevel}
          isSelected={false}
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
          <Item
            variant="outline"
            size="sm"
            className="bg-background relative w-64 shadow-lg"
          >
            {/* 아이콘 */}
            <ItemMedia variant="icon">
              <MapPin className="text-primary" />
            </ItemMedia>

            {/* 장소 정보 */}
            <ItemContent>
              <div className="flex items-center justify-between gap-2">
                <ItemTitle className="truncate">
                  {selectedPlace.place_name}
                </ItemTitle>
                {/* 액션 버튼들 */}
                <ItemActions>
                  {selectedPlace.place_url && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      asChild
                      aria-label="카카오맵에서 보기"
                    >
                      <a
                        href={selectedPlace.place_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setSelectedPlace(null)}
                    aria-label="닫기"
                  >
                    <X className="size-3.5" />
                  </Button>
                </ItemActions>
              </div>
              <ItemDescription className="truncate">
                {selectedPlace.road_address_name || selectedPlace.address_name}
              </ItemDescription>
              {selectedPlace.phone && (
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Phone className="size-3" />
                  <span>{selectedPlace.phone}</span>
                </div>
              )}
            </ItemContent>
          </Item>
        </CustomOverlayMap>
      )}
    </Map>
  );
}
