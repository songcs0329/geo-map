"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useShallow } from "zustand/shallow";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import usePlaceSearchStore from "@/stores/usePlaceSearchStore";
import { getFeatureCenter, getFeatureRadius } from "@/lib/kakaoGeoUtils";
import type { KakaoPlace, PlaceSearchSort } from "@/types/kakao-places.types";

/**
 * selectedFeature 또는 sort 변경 시 자동으로 장소 검색을 수행하는 훅
 * - 검색어: selectedFeature.properties.adm_nm의 마지막 단어
 * - 좌표: selectedFeature의 중심 좌표
 * - 반경: selectedFeature의 바운딩 박스에서 계산
 */
export function useKakaoPlacesSearch() {
  const searchParams = useSearchParams();
  const { map, selectedFeature } = useKakaoMapStore(
    useShallow((state) => ({
      map: state.map,
      selectedFeature: state.selectedFeature,
    }))
  );
  const { setPlaces, setIsSearching, clearPlaces } = usePlaceSearchStore(
    useShallow((state) => ({
      setPlaces: state.setPlaces,
      setIsSearching: state.setIsSearching,
      clearPlaces: state.clearPlaces,
    }))
  );

  const sort = (searchParams.get("sort") as PlaceSearchSort) ?? "accuracy";

  // selectedFeature 또는 sort 변경 시 자동 검색
  useEffect(() => {
    if (!map || !selectedFeature || !window.kakao?.maps?.services) {
      clearPlaces();
      return;
    }

    const keyword = selectedFeature.properties.adm_nm.split(" ").at(-1);
    if (!keyword) {
      clearPlaces();
      return;
    }

    const center = getFeatureCenter(selectedFeature);
    const radius = getFeatureRadius(selectedFeature);

    setIsSearching(true);
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      keyword,
      (data, status) => {
        setIsSearching(false);
        if (status === kakao.maps.services.Status.OK) {
          const places: KakaoPlace[] = data.map((place) => ({
            id: place.id,
            place_name: place.place_name,
            category_name: place.category_name,
            category_group_code: String(place.category_group_code ?? ""),
            category_group_name: place.category_group_name,
            phone: place.phone,
            address_name: place.address_name,
            road_address_name: place.road_address_name,
            x: place.x,
            y: place.y,
            place_url: place.place_url,
            distance: place.distance,
          }));
          setPlaces(places);
        } else {
          clearPlaces();
        }
      },
      {
        location: new kakao.maps.LatLng(center.lat, center.lng),
        radius,
        sort:
          sort === "distance"
            ? kakao.maps.services.SortBy.DISTANCE
            : kakao.maps.services.SortBy.ACCURACY,
      }
    );
  }, [map, selectedFeature, sort, setPlaces, setIsSearching, clearPlaces]);
}

export default useKakaoPlacesSearch;
