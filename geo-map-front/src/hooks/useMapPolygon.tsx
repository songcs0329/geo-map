"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import type {
  GeoJSONFeatureCollection,
  GeoJSONFeature,
  AdminLevel,
} from "@/types/shared/geojson.types";
import type { PolygonInstance, DistrictStyles } from "@/types/map";
import { NAVER_MAP_EVENTS } from "@/lib/constants";
import {
  applyStyle,
  convertCoordinatesToPaths,
  createDistrictStyles,
  filterFeaturesByBounds,
} from "@/lib/geoUtils";

interface UseMapPolygonOptions {
  map: naver.maps.Map | null;
  geoJSON: GeoJSONFeatureCollection | null;
  bounds: naver.maps.LatLngBounds | null;
  adminLevel: AdminLevel;
  onClick: (feature: GeoJSONFeature) => void;
}

function useMapPolygon({
  map,
  geoJSON,
  bounds,
  adminLevel,
  onClick,
}: UseMapPolygonOptions) {
  const polygonInstancesRef = useRef<PolygonInstance[]>([]);
  const selectedPolygonRef = useRef<naver.maps.Polygon | null>(null);
  const featureStylesRef = useRef<Map<naver.maps.Polygon, DistrictStyles>>(
    new Map()
  );

  const clearPolygons = useCallback(() => {
    for (const instance of polygonInstancesRef.current) {
      for (const listener of instance.listeners) {
        naver.maps.Event.removeListener(listener);
      }
      instance.polygon.setMap(null);
    }
    polygonInstancesRef.current = [];
    selectedPolygonRef.current = null;
    featureStylesRef.current.clear();
  }, []);

  const createPolygon = useCallback(
    (feature: GeoJSONFeature): PolygonInstance | null => {
      if (!map || !window.naver?.maps) return null;

      const { geometry } = feature;
      const styles = createDistrictStyles(feature, adminLevel);

      const paths = convertCoordinatesToPaths(
        geometry.coordinates,
        geometry.type
      );

      const polygon = new window.naver.maps.Polygon({
        map,
        paths,
        fillColor: styles.style.fillColor,
        fillOpacity: styles.style.fillOpacity,
        strokeColor: styles.style.strokeColor,
        strokeWeight: styles.style.strokeWeight,
        strokeOpacity: styles.style.strokeOpacity,
        clickable: true,
      });

      // 스타일 저장
      featureStylesRef.current.set(polygon, styles);

      const listeners: naver.maps.MapEventListener[] = [];

      // hover 이벤트
      const mouseOverListener = naver.maps.Event.addListener(
        polygon,
        NAVER_MAP_EVENTS.MOUSEOVER,
        () => {
          if (selectedPolygonRef.current !== polygon) {
            applyStyle(polygon, styles.hoverStyle);
          }
        }
      );
      listeners.push(mouseOverListener);

      const mouseOutListener = naver.maps.Event.addListener(
        polygon,
        NAVER_MAP_EVENTS.MOUSEOUT,
        () => {
          if (selectedPolygonRef.current === polygon) {
            applyStyle(polygon, styles.clickStyle);
          } else {
            applyStyle(polygon, styles.style);
          }
        }
      );
      listeners.push(mouseOutListener);

      // click 이벤트
      const clickListener = naver.maps.Event.addListener(
        polygon,
        NAVER_MAP_EVENTS.CLICK,
        () => {
          // 이전 선택 복원
          if (
            selectedPolygonRef.current &&
            selectedPolygonRef.current !== polygon
          ) {
            const prevStyles = featureStylesRef.current.get(
              selectedPolygonRef.current
            );
            if (prevStyles) {
              applyStyle(selectedPolygonRef.current, prevStyles.style);
            }
          }

          // 토글 선택
          if (selectedPolygonRef.current === polygon) {
            applyStyle(polygon, styles.style);
            selectedPolygonRef.current = null;
          } else {
            applyStyle(polygon, styles.clickStyle);
            selectedPolygonRef.current = polygon;
          }

          onClick(feature);
        }
      );
      listeners.push(clickListener);

      return { polygon, feature, listeners };
    },
    [map, adminLevel, onClick]
  );

  // bounds로 필터링된 features 계산
  const visibleFeatures = useMemo(() => {
    if (!geoJSON) return [];
    return filterFeaturesByBounds(geoJSON.features, bounds);
  }, [geoJSON, bounds]);

  useEffect(() => {
    if (!map || !window.naver?.maps) return;

    clearPolygons();

    for (const feature of visibleFeatures) {
      const instance = createPolygon(feature);
      if (instance) {
        polygonInstancesRef.current.push(instance);
      }
    }

    return () => {
      clearPolygons();
    };
  }, [map, visibleFeatures, createPolygon, clearPolygons]);

  return {
    polygonInstancesRef,
    selectedPolygonRef,
    clearPolygons,
  };
}

export default useMapPolygon;
