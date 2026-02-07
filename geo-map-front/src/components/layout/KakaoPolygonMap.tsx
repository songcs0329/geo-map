"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Map } from "react-kakao-maps-sdk";
import { useShallow } from "zustand/shallow";
import useKakaoLoader from "@/hooks/kakao/useKakaoLoader";
import useInitSearchParamsMapOptions from "@/hooks/kakao/useInitSearchParamsMapOptions";
import useAdminGeoJSON from "@/hooks/map/useGetGeoJSON";
import useGetKakaoPlacesSearch from "@/hooks/kakao/useGetKakaoPlacesSearch";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import usePlaceSearchStore from "@/stores/usePlaceSearchStore";
import {
  filterFeaturesByBounds,
  getAdminLevelByKakaoLevel,
} from "@/lib/kakaoMapUtils";
import PolygonLayer from "./PolygonLayer";
import PlaceMarker from "../pages/place-search/PlaceMarker";
import SelectedPlaceOverlay from "../pages/place-search/SelectedPlaceOverlay";
import type { GeoJSONFeature } from "@/types/shared/geojson.types";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

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

  // 지도 상태 및 액션 (단일 selector로 통합)
  const { level, bounds, setMap, setLevel, setBounds } = useKakaoMapStore(
    useShallow((state) => ({
      level: state.level,
      bounds: state.bounds,
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

  const { state, isMobile } = useSidebar();

  const isSidebarTriggerVisible = useMemo(() => {
    if (isMobile) return true;
    return state === "collapsed";
  }, [state, isMobile]);

  // Kakao Maps SDK 로더 상태
  const { loading, error } = useKakaoLoader();

  // 장소 검색 결과 (searchParams 기반)
  const { places } = useGetKakaoPlacesSearch();

  // 초기 지도 옵션 (searchParams에서 최초 마운트 시에만 읽음)
  const { mapCenter, mapLevel } = useInitSearchParamsMapOptions();

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

  /**
   * Map 생성 시 호출되는 콜백
   * - 지도 인스턴스 저장 및 초기 상태 설정
   */
  const handleMapCreate = useCallback(
    (mapInstance: kakao.maps.Map) => {
      const { map } = useKakaoMapStore.getState();
      if (map) return;
      setMap(mapInstance);
      setLevel(mapInstance.getLevel());
      setBounds(mapInstance.getBounds());
    },
    [setMap, setLevel, setBounds]
  );

  /**
   * 줌 레벨 변경 시 호출되는 콜백
   */
  const handleZoomChanged = useCallback(
    (map: kakao.maps.Map) => {
      setLevel(map.getLevel());
      setBounds(map.getBounds());
    },
    [setLevel, setBounds]
  );

  /**
   * 지도 영역 변경 시 호출되는 콜백
   */
  const handleBoundsChanged = useCallback(
    (map: kakao.maps.Map) => {
      setBounds(map.getBounds());
    },
    [setBounds]
  );

  /**
   * 오버레이 닫기 핸들러
   */
  const handleCloseOverlay = useCallback(() => {
    setSelectedPlace(null);
  }, [setSelectedPlace]);

  // 로딩 또는 에러 시 렌더링 안 함
  if (loading || error) return null;

  return (
    <>
      {/* 사이드바 토글 버튼 (지도 위 좌측 상단) */}
      {isSidebarTriggerVisible && (
        <SidebarTrigger className="absolute top-4 left-4 z-10 bg-white shadow-md" />
      )}

      <Map
        center={mapCenter}
        level={mapLevel}
        style={{ width: "100%", height: "100vh" }}
        onCreate={handleMapCreate}
        onZoomChanged={handleZoomChanged}
        onBoundsChanged={handleBoundsChanged}
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
          <PlaceMarker
            key={place.id}
            place={place}
            onSelect={setSelectedPlace}
          />
        ))}

        {/* 선택된 장소 정보 오버레이 */}
        {selectedPlace && (
          <SelectedPlaceOverlay
            place={selectedPlace}
            onClose={handleCloseOverlay}
          />
        )}
      </Map>
    </>
  );
}
