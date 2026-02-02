/**
 * 이 파일은 geo-map-server에서 자동 동기화됩니다.
 * 직접 수정하지 마세요. 수정이 필요하면 서버 타입을 수정 후 sync-types를 실행하세요.
 *
 * 원본: geo-map-server/src/types/geojson.types.ts
 * 동기화: npm run sync-types
 */

export type AdminLevel = 'sido' | 'sgg' | 'dong';

export interface GeoJSONFeatureProperties {
  OBJECTID: number;
  adm_nm: string;
  adm_cd: string;
  adm_cd2: string;
  sgg: string;
  sido: string;
  sidonm: string;
  sggnm: string;
  [key: string]: unknown;
}

export interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: GeoJSONFeatureProperties;
  geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
