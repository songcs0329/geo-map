// GeoJSON Types (raqoon886/Local_HangJeongDong format)
export interface GeoJSONFeatureProperties {
  OBJECTID: number;
  adm_nm: string; // 행정구역명 (서울특별시 종로구 사직동)
  adm_cd: string; // 행정코드
  adm_cd2: string; // 행정코드2
  sgg: string; // 시군구 코드
  sido: string; // 시도 코드 (11 = 서울)
  sidonm: string; // 시도명 (서울특별시)
  sggnm: string; // 시군구명 (종로구)
  [key: string]: unknown;
}

export interface GeoJSONGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: GeoJSONFeatureProperties;
  geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Polygon Style Types
export interface PolygonStyle {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
}

export interface PolygonRegionConfig {
  code: string;
  style: PolygonStyle;
  hoverStyle: PolygonStyle;
  clickStyle?: PolygonStyle;
}

export interface PolygonInstance {
  polygon: naver.maps.Polygon;
  feature: GeoJSONFeature;
  listeners: naver.maps.MapEventListener[];
}
