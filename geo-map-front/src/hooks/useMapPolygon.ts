"use client";

import { useEffect, useRef, useCallback } from "react";
import type {
  GeoJSONFeatureCollection,
  GeoJSONFeature,
  PolygonStyle,
  PolygonEventHandlers,
  PolygonInstance,
} from "@/types/map";
import { DISTRICT_COLORS, POLYGON_STYLES } from "@/lib/constants";

/**
 * 구(sggnm) 기준으로 폴리곤 색상 가져오기
 */
function getDistrictColor(feature: GeoJSONFeature): string {
  const district = feature.properties.sggnm;
  return DISTRICT_COLORS[district] || "#3B82F6"; // 기본값: 파란색
}

/**
 * 구 기준 스타일 생성
 */
function createDistrictStyles(feature: GeoJSONFeature): {
  style: PolygonStyle;
  hoverStyle: PolygonStyle;
  clickStyle: PolygonStyle;
} {
  const fillColor = getDistrictColor(feature);

  return {
    style: {
      fillColor,
      fillOpacity: POLYGON_STYLES.DEFAULT_FILL_OPACITY,
      strokeColor: POLYGON_STYLES.STROKE_COLOR,
      strokeWeight: POLYGON_STYLES.STROKE_WEIGHT,
      strokeOpacity: 0.8,
    },
    hoverStyle: {
      fillColor,
      fillOpacity: POLYGON_STYLES.DEFAULT_FILL_OPACITY, // 채우기는 그대로
      strokeColor: POLYGON_STYLES.HOVER_STROKE_COLOR, // 라인만 강조
      strokeWeight: POLYGON_STYLES.HOVER_STROKE_WEIGHT,
      strokeOpacity: 1,
    },
    clickStyle: {
      fillColor,
      fillOpacity: POLYGON_STYLES.SELECTED_FILL_OPACITY,
      strokeColor: "#000000",
      strokeWeight: 3,
      strokeOpacity: 1,
    },
  };
}

interface UseMapPolygonOptions {
  map: naver.maps.Map | null;
  geoJSON: GeoJSONFeatureCollection | null;
  eventHandlers?: PolygonEventHandlers;
  enableHover?: boolean;
  enableClick?: boolean;
}

function convertCoordinatesToPaths(
  coordinates: number[][][] | number[][][][],
  geometryType: "Polygon" | "MultiPolygon"
): naver.maps.ArrayOfCoords[] {
  const paths: naver.maps.ArrayOfCoords[] = [];

  if (geometryType === "Polygon") {
    const rings = coordinates as number[][][];
    for (const ring of rings) {
      const path: naver.maps.LatLng[] = ring.map(
        ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
      );
      paths.push(path);
    }
  } else {
    const polygons = coordinates as number[][][][];
    for (const polygon of polygons) {
      for (const ring of polygon) {
        const path: naver.maps.LatLng[] = ring.map(
          ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
        );
        paths.push(path);
      }
    }
  }

  return paths;
}

function applyStyle(polygon: naver.maps.Polygon, style: PolygonStyle): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = polygon as any;
  p.setStyles({
    fillColor: style.fillColor,
    fillOpacity: style.fillOpacity,
    strokeColor: style.strokeColor,
    strokeWeight: style.strokeWeight,
    strokeOpacity: style.strokeOpacity,
  });
}

export function useMapPolygon({
  map,
  geoJSON,
  eventHandlers,
  enableHover = true,
  enableClick = true,
}: UseMapPolygonOptions) {
  const polygonInstancesRef = useRef<PolygonInstance[]>([]);
  const selectedPolygonRef = useRef<naver.maps.Polygon | null>(null);
  const featureStylesRef = useRef<
    Map<naver.maps.Polygon, { style: PolygonStyle; hoverStyle: PolygonStyle; clickStyle: PolygonStyle }>
  >(new Map());

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
      const styles = createDistrictStyles(feature);

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

      if (enableHover) {
        const mouseOverListener = naver.maps.Event.addListener(
          polygon,
          "mouseover",
          () => {
            if (selectedPolygonRef.current !== polygon) {
              applyStyle(polygon, styles.hoverStyle);
            }
            eventHandlers?.onMouseOver?.(feature, polygon);
          }
        );
        listeners.push(mouseOverListener);

        const mouseOutListener = naver.maps.Event.addListener(
          polygon,
          "mouseout",
          () => {
            if (selectedPolygonRef.current === polygon) {
              applyStyle(polygon, styles.clickStyle);
            } else {
              applyStyle(polygon, styles.style);
            }
            eventHandlers?.onMouseOut?.(feature, polygon);
          }
        );
        listeners.push(mouseOutListener);
      }

      if (enableClick) {
        const clickListener = naver.maps.Event.addListener(
          polygon,
          "click",
          () => {
            // 이전 선택 복원
            if (selectedPolygonRef.current && selectedPolygonRef.current !== polygon) {
              const prevStyles = featureStylesRef.current.get(selectedPolygonRef.current);
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

            eventHandlers?.onClick?.(feature, polygon);
          }
        );
        listeners.push(clickListener);
      }

      return { polygon, feature, listeners };
    },
    [map, eventHandlers, enableHover, enableClick]
  );

  useEffect(() => {
    if (!map || !geoJSON || !window.naver?.maps) return;

    clearPolygons();

    for (const feature of geoJSON.features) {
      const instance = createPolygon(feature);
      if (instance) {
        polygonInstancesRef.current.push(instance);
      }
    }

    return () => {
      clearPolygons();
    };
  }, [map, geoJSON, createPolygon, clearPolygons]);

  return {
    polygonInstancesRef,
    selectedPolygonRef,
    clearPolygons,
  };
}
