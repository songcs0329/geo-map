import type { GeoJSONFeature } from "./shared/geojson.types";

// ========================================
// 프론트엔드 전용 타입
// ========================================

// Feature Bounds (for intersection check)
export interface FeatureBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// Polygon Style Types
export interface PolygonStyle {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
}

export interface DistrictStyles {
  style: PolygonStyle;
  hoverStyle: PolygonStyle;
  clickStyle: PolygonStyle;
}

export interface PolygonInstance {
  polygon: naver.maps.Polygon;
  feature: GeoJSONFeature;
  listeners: naver.maps.MapEventListener[];
}
