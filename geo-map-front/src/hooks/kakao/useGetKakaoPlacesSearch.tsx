"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { KakaoPlace, PlaceSearchSort } from "@/types/kakao-places.types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

/**
 * 카카오 Places API 응답 메타데이터
 */
interface PlacesSearchMeta {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
}

/**
 * 카카오 장소 검색 결과
 */
interface PlacesSearchResult {
  places: KakaoPlace[];
  meta: PlacesSearchMeta;
  page: number;
}

/**
 * kakao.maps.services.Places SDK를 사용하여 장소 검색
 * Promise 기반으로 래핑하여 useInfiniteQuery와 호환
 */
const searchPlaces = (params: {
  query: string;
  x?: string;
  y?: string;
  sort: PlaceSearchSort;
  page: number;
  size: number;
  category_group_code?: string;
}): Promise<PlacesSearchResult> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao?.maps?.services) {
      reject(new Error("카카오 맵 서비스를 사용할 수 없습니다."));
      return;
    }

    const ps = new kakao.maps.services.Places();

    const options: kakao.maps.services.PlacesSearchOptions = {
      page: params.page,
      size: params.size,
      sort:
        params.sort === "distance"
          ? kakao.maps.services.SortBy.DISTANCE
          : kakao.maps.services.SortBy.ACCURACY,
    };

    // 좌표가 있으면 위치 기반 검색
    if (params.x && params.y) {
      options.location = new kakao.maps.LatLng(
        Number(params.y),
        Number(params.x)
      );
    }

    // 카테고리 필터 (단일 문자열 또는 배열 모두 가능)
    if (params.category_group_code) {
      options.category_group_code =
        params.category_group_code as `${kakao.maps.CategoryCode}`;
    }

    ps.keywordSearch(
      params.query,
      (data, status, pagination) => {
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

          resolve({
            places,
            meta: {
              is_end: !pagination.hasNextPage,
              pageable_count: pagination.totalCount,
              total_count: pagination.totalCount,
            },
            page: params.page,
          });
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          resolve({
            places: [],
            meta: {
              is_end: true,
              pageable_count: 0,
              total_count: 0,
            },
            page: params.page,
          });
        } else {
          reject(new Error("장소 검색에 실패했습니다."));
        }
      },
      options
    );
  });
};

/**
 * useGetKakaoPlacesSearch
 *
 * 역할: searchParams 기반 카카오 장소 검색 API 호출 훅
 * - useInfiniteQuery로 페이지네이션 지원
 * - searchParams(query, x, y, sort, category_group_code) 변경 시 자동 재검색
 * - 무한 스크롤을 위한 fetchNextPage, hasNextPage 제공
 *
 * @returns places - 전체 장소 목록 (모든 페이지 병합)
 * @returns totalCount - 총 검색 결과 수
 * @returns isLoading - 초기 로딩 상태
 * @returns isFetchingNextPage - 다음 페이지 로딩 상태
 * @returns hasNextPage - 다음 페이지 존재 여부
 * @returns fetchNextPage - 다음 페이지 로드 함수
 * @returns error - 에러 객체
 */
export function useGetKakaoPlacesSearch() {
  const searchParams = useSearchParams();

  // searchParams에서 검색 조건 추출
  const query = searchParams.get("query") ?? "";
  const x = searchParams.get("x") ?? undefined;
  const y = searchParams.get("y") ?? undefined;
  const sort = (searchParams.get("sort") as PlaceSearchSort) ?? "accuracy";
  const category_group_code =
    searchParams.get("category_group_code") ?? undefined;

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["kakao", "places", query, x, y, sort, category_group_code],
    queryFn: ({ pageParam = 1 }) =>
      searchPlaces({
        query,
        x,
        y,
        sort,
        page: pageParam,
        size: DEFAULT_PAGE_SIZE,
        category_group_code,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // 마지막 페이지이거나 결과가 없으면 다음 페이지 없음
      if (lastPage.meta.is_end || lastPage.places.length === 0) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    // query가 있을 때만 검색 실행
    enabled: !!query && query.length >= 1,
  });

  // 모든 페이지의 장소 목록 병합
  const places = data?.pages.flatMap((page) => page.places) ?? [];
  const totalCount = data?.pages[0]?.meta.total_count ?? 0;

  /**
   * 지도 이동 시 재검색 트리거
   * (좌표 변경 후 명시적으로 호출)
   */
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    places,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    error,
    refresh,
  };
}

export default useGetKakaoPlacesSearch;
