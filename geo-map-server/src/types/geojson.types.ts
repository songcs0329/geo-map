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
