import type { GeoJSONFeature } from "./shared/geojson.types";

// ========================================
// 카카오 지도 전용 타입
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

export interface KakaoPolygonInstance {
  polygon: kakao.maps.Polygon;
  feature: GeoJSONFeature;
}
