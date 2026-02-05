"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash-es";
import type { AdminLevel } from "@/types/shared/geojson.types";
import { getAdminLevelByZoom } from "@/lib/geoUtils";
import { MAP_CONFIG, NAVER_MAP_EVENTS } from "@/lib/constants";

/**
 * 지도 bounds 상태 인터페이스
 * @property bounds - 현재 지도의 영역 (남서-북동 좌표)
 * @property zoom - 현재 줌 레벨 (0-21)
 * @property adminLevel - 줌 레벨에 따른 행정구역 단위 (sido | sgg)
 */
export interface MapBoundsState {
  bounds: naver.maps.LatLngBounds | null;
  zoom: number;
  adminLevel: AdminLevel;
}

/**
 * useMapBounds 훅 옵션
 * @property debounceMs - 이벤트 디바운스 시간 (ms), 기본값 600ms
 */
export interface UseMapBoundsOptions {
  debounceMs?: number;
}

/**
 * 지도의 bounds와 zoom 레벨을 추적하는 훅
 *
 * @param map - Naver Maps 인스턴스 (null이면 비활성)
 * @param options - 디바운스 시간 등 옵션
 * @returns MapBoundsState - 현재 지도 상태 (bounds, zoom, adminLevel)
 *
 * @example
 * const { bounds, zoom, adminLevel } = useMapBounds(map, { debounceMs: 300 });
 */
function useMapBounds(
  map: naver.maps.Map | null,
  options: UseMapBoundsOptions = {}
): MapBoundsState {
  /** 디바운스 대기 시간 (기본 600ms) */
  const { debounceMs = 600 } = options;

  /**
   * 지도 bounds 상태
   * - bounds: 지도 영역 좌표
   * - zoom: 현재 줌 레벨
   * - adminLevel: 표시할 행정구역 단위
   */
  const [mapBoundsState, setMapBoundsState] = useState<MapBoundsState>({
    bounds: null,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
    adminLevel: getAdminLevelByZoom(MAP_CONFIG.DEFAULT_ZOOM),
  });

  /**
   * 지도에서 현재 bounds, zoom을 읽어 상태 업데이트
   * - map.getBounds(): 현재 지도 영역
   * - map.getZoom(): 현재 줌 레벨
   * - getAdminLevelByZoom(): 줌 레벨에 따른 행정구역 단위 결정
   */
  const updateMapBoundsState = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds() as naver.maps.LatLngBounds;
    const zoom = map.getZoom();
    const adminLevel = getAdminLevelByZoom(zoom);

    setMapBoundsState({ bounds, zoom, adminLevel });
  }, [map]);

  /**
   * 디바운스된 상태 업데이트 함수
   * - 빠른 연속 이벤트 시 마지막 호출만 실행
   * - 지도 드래그/줌 시 과도한 렌더링 방지
   */
  const debouncedUpdateMapBoundsState = useMemo(
    () => debounce(updateMapBoundsState, debounceMs),
    [updateMapBoundsState, debounceMs]
  );

  /**
   * 초기 상태 동기화
   * - map이 준비되면 현재 지도 상태로 초기화
   * - queueMicrotask: 마이크로태스크 큐에서 비동기 실행하여 cascading render 방지(https://developer.mozilla.org/ko/docs/Web/API/Window/queueMicrotask)
   */
  useEffect(() => {
    if (!map || !window.naver?.maps) return;

    queueMicrotask(() => {
      const bounds = map.getBounds() as naver.maps.LatLngBounds;
      const zoom = map.getZoom();
      const adminLevel = getAdminLevelByZoom(zoom);

      setMapBoundsState({ bounds, zoom, adminLevel });
    });
  }, [map]);

  /**
   * 지도 이벤트 리스너 등록/해제
   * - bounds_changed: 지도 영역 변경 시 (드래그, 줌 등)
   * - zoom_changed: 줌 레벨 변경 시
   * - cleanup: 디바운스 취소 및 리스너 해제
   */
  useEffect(() => {
    if (!map || !window.naver?.maps) return;

    const boundsListener = naver.maps.Event.addListener(
      map,
      NAVER_MAP_EVENTS.BOUNDS_CHANGED,
      debouncedUpdateMapBoundsState
    );

    const zoomListener = naver.maps.Event.addListener(
      map,
      NAVER_MAP_EVENTS.ZOOM_CHANGED,
      debouncedUpdateMapBoundsState
    );

    return () => {
      debouncedUpdateMapBoundsState.cancel();
      naver.maps.Event.removeListener(boundsListener);
      naver.maps.Event.removeListener(zoomListener);
    };
  }, [map, debouncedUpdateMapBoundsState]);

  return mapBoundsState;
}

export default useMapBounds;
