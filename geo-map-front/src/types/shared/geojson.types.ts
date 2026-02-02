/**
 * 이 파일은 geo-map-server에서 자동 동기화됩니다.
 * 직접 수정하지 마세요. 수정이 필요하면 서버 타입을 수정 후 sync-types를 실행하세요.
 *
 * 원본: geo-map-server/src/types/geojson.types.ts
 * 동기화: npm run sync-types
 */

/**
 * 공유 GeoJSON 타입 정의
 *
 * 이 파일은 geo-map-server와 geo-map-front에서 공유되는 타입입니다.
 * 수정 시 프론트엔드에서 `npm run sync-types` 실행하여 동기화하세요.
 */

export type AdminLevel = "sido" | "sgg" | "dong";

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
