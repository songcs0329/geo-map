import type {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  AdminLevel,
} from "@/types/shared/geojson.types";
import { SGG_PALETTE, SIDO_COLORS, KAKAO_ZOOM_LEVELS } from "./constants";

/**
 * Feature 바운딩 박스 타입
 */
export interface FeatureBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * 폴리곤 스타일 타입
 */
export interface PolygonStyle {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
}

/**
 * 문자열을 숫자 해시값으로 변환
 * - 시군구 코드를 색상 팔레트 인덱스로 변환할 때 사용
 * @param str - 해시할 문자열 (예: 시군구 코드)
 * @returns 항상 양수인 해시값
 */
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * 시군구(SGG) 코드를 기반으로 고유 색상 반환
 * - 해시 함수를 사용하여 같은 코드는 항상 같은 색상 반환
 * @param sggCode - 5자리 시군구 코드 (예: "11110")
 * @returns 헥스 색상 코드
 */
export function getSggColor(sggCode: string): string {
  const index = hashCode(sggCode) % SGG_PALETTE.length;
  return SGG_PALETTE[index];
}

/**
 * 행정 레벨에 따라 피처(폴리곤)의 채우기 색상 결정
 * - sido: 시/도별 고정 색상 (SIDO_COLORS)
 * - sgg: 시군구 코드 기반 해시 색상
 * @param feature - GeoJSON Feature 객체
 * @param adminLevel - 현재 행정 레벨 ("sido" | "sgg")
 * @returns 헥스 색상 코드
 */
export function getFeatureColor(
  feature: GeoJSONFeature,
  adminLevel: AdminLevel
): string {
  const { sido, sgg } = feature.properties;

  switch (adminLevel) {
    case "sido":
      return SIDO_COLORS[sido] || "#3B82F6";
    case "sgg":
    default:
      return getSggColor(sgg);
  }
}

/**
 * 현재 줌 레벨에 따라 표시할 행정구역 레벨 결정 (카카오맵 기준)
 * - 카카오맵은 level이 낮을수록 확대됨 (네이버와 반대)
 * - level 10~12: 시/도 (sido) - 17개
 * - level 7~9: 시군구 (sgg) - ~250개
 * @param level - 현재 카카오 지도 레벨
 * @returns "sido" | "sgg"
 */
export function getAdminLevelByZoom(level: number): AdminLevel {
  if (level >= KAKAO_ZOOM_LEVELS.SIDO.min) {
    return "sido";
  }
  return "sgg";
}

/**
 * adm_cd(행정동 코드)로 GeoJSON Feature 조회
 * - FeatureCollection에서 adm_cd가 일치하는 Feature 반환
 * - 없으면 undefined 반환
 * @param geoJSON - 검색할 GeoJSON FeatureCollection
 * @param admCd - 행정동 코드 (예: "1101053")
 * @returns 일치하는 GeoJSONFeature 또는 undefined
 */
export function getFeatureByAdmCd(
  geoJSON: GeoJSONFeatureCollection,
  admCd: string
): GeoJSONFeature | undefined {
  return geoJSON.features.find(
    (feature) => feature.properties.adm_cd === admCd
  );
}

/**
 * GeoJSON Feature의 바운딩 박스(AABB) 계산
 * - 모든 좌표를 순회하여 최소/최대 위도/경도 추출
 * - 지도 영역과의 교차 검사에 사용
 * @param feature - GeoJSON Feature 객체
 * @returns 최소/최대 위도/경도를 담은 FeatureBounds 객체
 */
export function getFeatureBounds(feature: GeoJSONFeature): FeatureBounds {
  const { geometry } = feature;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  const processCoordinate = (coord: number[]) => {
    const [lng, lat] = coord;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  };

  const processRing = (ring: number[][]) => {
    for (const coord of ring) {
      processCoordinate(coord);
    }
  };

  if (geometry.type === "Polygon") {
    const coordinates = geometry.coordinates as number[][][];
    for (const ring of coordinates) {
      processRing(ring);
    }
  } else if (geometry.type === "MultiPolygon") {
    const coordinates = geometry.coordinates as number[][][][];
    for (const polygon of coordinates) {
      for (const ring of polygon) {
        processRing(ring);
      }
    }
  }

  return { minLat, maxLat, minLng, maxLng };
}

export function getRegionPrefix(address: string): string {
  const parts = address.split(" ");
  return parts[parts.length - 1];
}
