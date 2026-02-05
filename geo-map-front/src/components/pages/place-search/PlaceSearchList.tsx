"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapPin, Phone, ExternalLink, Loader2 } from "lucide-react";
import { useShallow } from "zustand/shallow";
import useGetKakaoPlacesSearch from "@/hooks/kakao/useGetKakaoPlacesSearch";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import usePlaceSearchStore from "@/stores/usePlaceSearchStore";
import type { KakaoPlace } from "@/types/kakao-places.types";

/**
 * PlaceSearchListItem
 *
 * 역할: 장소 검색 결과 개별 아이템 컴포넌트
 * - 장소명, 카테고리, 주소, 전화번호 표시
 * - 클릭 시 해당 장소로 지도 이동 및 선택 상태 설정
 */
function PlaceSearchListItem({
  place,
  isSelected,
  onSelect,
}: {
  place: KakaoPlace;
  isSelected: boolean;
  onSelect: (place: KakaoPlace) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(place)}
      className={`border-border hover:bg-accent/50 w-full border-b p-3 text-left transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      {/* 장소명 및 카테고리 */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm leading-tight font-medium">
          {place.place_name}
        </h4>
        {place.place_url && (
          <a
            href={place.place_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="카카오맵에서 보기"
          >
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      {/* 카테고리 */}
      {place.category_name && (
        <p className="text-muted-foreground mt-0.5 truncate text-xs">
          {place.category_name}
        </p>
      )}

      {/* 주소 */}
      <div className="text-muted-foreground mt-1.5 flex items-center gap-1 text-xs">
        <MapPin className="size-3 shrink-0" />
        <span className="truncate">
          {place.road_address_name || place.address_name}
        </span>
      </div>

      {/* 전화번호 */}
      {place.phone && (
        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <Phone className="size-3 shrink-0" />
          <span>{place.phone}</span>
        </div>
      )}

      {/* 거리 (있는 경우) */}
      {place.distance && (
        <p className="text-primary mt-1 text-xs">{place.distance}m</p>
      )}
    </button>
  );
}

/**
 * PlaceSearchList
 *
 * 역할: 장소 검색 결과 무한 스크롤 리스트 컴포넌트
 * - useGetKakaoPlacesSearch 훅으로 검색 결과 조회
 * - IntersectionObserver로 스크롤 끝 감지 및 다음 페이지 자동 로드
 * - 리스트 아이템 클릭 시 해당 장소로 지도 이동
 *
 * 상태:
 * - 로딩 중: 스피너 표시
 * - 결과 없음: 안내 메시지 표시
 * - 에러: 에러 메시지 표시
 */
function PlaceSearchList() {
  const {
    places,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useGetKakaoPlacesSearch();

  const { map } = useKakaoMapStore(
    useShallow((state) => ({
      map: state.map,
    }))
  );

  const { selectedPlace, setSelectedPlace } = usePlaceSearchStore(
    useShallow((state) => ({
      selectedPlace: state.selectedPlace,
      setSelectedPlace: state.setSelectedPlace,
    }))
  );

  // IntersectionObserver 타겟 ref
  const observerTarget = useRef<HTMLDivElement>(null);

  /**
   * 장소 선택 핸들러
   * - 선택된 장소로 지도 이동
   * - store에 선택 상태 저장
   */
  const handleSelectPlace = useCallback(
    (place: KakaoPlace) => {
      setSelectedPlace(place);

      // 지도가 있으면 해당 장소로 이동
      if (map && window.kakao?.maps) {
        const latlng = new kakao.maps.LatLng(Number(place.y), Number(place.x));
        map.panTo(latlng);
      }
    },
    [map, setSelectedPlace]
  );

  /**
   * IntersectionObserver 설정
   * - 스크롤 끝에 도달하면 다음 페이지 자동 로드
   */
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 타겟이 보이고, 다음 페이지가 있고, 로딩 중이 아니면 다음 페이지 로드
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 초기 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-destructive text-sm">검색 중 오류가 발생했습니다.</p>
        <p className="text-muted-foreground mt-1 text-xs">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  // 검색 결과 없음
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MapPin className="text-muted-foreground mb-2 size-8" />
        <p className="text-muted-foreground text-sm">
          검색어를 입력하여
          <br />
          주변 장소를 찾아보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* 장소 목록 */}
      {places.map((place) => (
        <PlaceSearchListItem
          key={place.id}
          place={place}
          isSelected={selectedPlace?.id === place.id}
          onSelect={handleSelectPlace}
        />
      ))}

      {/* IntersectionObserver 타겟 (무한 스크롤) */}
      <div ref={observerTarget} className="h-4" />

      {/* 다음 페이지 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
        </div>
      )}

      {/* 마지막 페이지 안내 */}
      {!hasNextPage && places.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-xs">
          모든 결과를 불러왔습니다.
        </p>
      )}
    </div>
  );
}

export default PlaceSearchList;
