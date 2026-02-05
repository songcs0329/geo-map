import type {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  AdminLevel,
} from "@/types/shared/geojson.types";
import type { FeatureBounds, PolygonStyle } from "@/types/kakao-map.types";
import { POLYGON_STYLES, SGG_PALETTE, SIDO_COLORS, KAKAO_ZOOM_LEVELS, CATEGORY_ICONS } from "./constants";

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
 * 현재 카카오 지도 레벨에 따라 표시할 행정구역 레벨 결정
 * - 카카오 level: 낮을수록 확대 (1=최대확대, 14=최대축소)
 * - level 10~14: 시/도 (sido)
 * - level 1~9: 시군구 (sgg)
 * @param level - 현재 카카오 지도 레벨
 * @returns "sido" | "sgg"
 */
export function getAdminLevelByKakaoLevel(level: number): AdminLevel {
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
 * Feature 바운딩 박스와 지도 바운딩 박스의 교차 여부 검사 (AABB 충돌 검사)
 * - 두 사각형이 겹치지 않는 4가지 경우를 체크
 * - 화면 밖 폴리곤 필터링으로 렌더링 성능 최적화
 * @param featureBounds - Feature의 바운딩 박스
 * @param mapBounds - 현재 카카오 지도 화면의 바운딩 박스
 * @returns true면 화면에 보임, false면 화면 밖
 */
export function boundsIntersect(
  featureBounds: FeatureBounds,
  mapBounds: kakao.maps.LatLngBounds
): boolean {
  const sw = mapBounds.getSouthWest();
  const ne = mapBounds.getNorthEast();

  const mapMinLat = sw.getLat();
  const mapMaxLat = ne.getLat();
  const mapMinLng = sw.getLng();
  const mapMaxLng = ne.getLng();

  // Check if bounds intersect (AABB intersection)
  return !(
    featureBounds.maxLat < mapMinLat ||
    featureBounds.minLat > mapMaxLat ||
    featureBounds.maxLng < mapMinLng ||
    featureBounds.minLng > mapMaxLng
  );
}

/**
 * GeoJSON Feature의 바운딩 박스(AABB) 계산
 * - 모든 좌표를 순회하여 최소/최대 위도/경도 추출
 * - 지도 영역과의 교차 검사(boundsIntersect)에 사용
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

/**
 * 현재 지도 화면(bounds) 내에 보이는 Feature만 필터링
 * - 각 Feature의 바운딩 박스와 지도 바운딩 박스 교차 검사
 * - 렌더링할 폴리곤 수를 줄여 성능 향상
 * @param features - 전체 GeoJSON Feature 배열
 * @param mapBounds - 현재 카카오 지도 화면의 바운딩 박스 (null이면 전체 반환)
 * @returns 화면 내에 보이는 Feature 배열
 */
export function filterFeaturesByBounds(
  features: GeoJSONFeature[],
  mapBounds: kakao.maps.LatLngBounds | null
): GeoJSONFeature[] {
  if (!mapBounds) return features;

  return features.filter((feature) => {
    const featureBounds = getFeatureBounds(feature);
    return boundsIntersect(featureBounds, mapBounds);
  });
}

/**
 * GeoJSON FeatureCollection에서 현재 화면에 보이는 Feature만 추출
 * - filterFeaturesByBounds의 래퍼 함수
 * - null 체크 포함
 * @param geoJSON - GeoJSON FeatureCollection (null 가능)
 * @param mapBounds - 현재 지도 화면의 바운딩 박스
 * @returns 화면 내에 보이는 Feature 배열
 */
export function getVisibleFeatures(
  geoJSON: GeoJSONFeatureCollection | null,
  mapBounds: kakao.maps.LatLngBounds | null
): GeoJSONFeature[] {
  if (!geoJSON) return [];
  return filterFeaturesByBounds(geoJSON.features, mapBounds);
}

/**
 * 폴리곤의 기본/호버/클릭 상태별 스타일 객체 생성
 * - style: 기본 상태 (낮은 투명도)
 * - hoverStyle: 마우스 오버 시 (중간 투명도)
 * - clickStyle: 클릭/선택 시 (높은 투명도)
 * @param feature - GeoJSON Feature 객체
 * @param adminLevel - 현재 행정 레벨
 * @returns 3가지 상태의 PolygonStyle 객체
 */
export function createDistrictStyles(
  feature: GeoJSONFeature,
  adminLevel: AdminLevel
): {
  style: PolygonStyle;
  hoverStyle: PolygonStyle;
  clickStyle: PolygonStyle;
} {
  const fillColor = getFeatureColor(feature, adminLevel);
  const baseStroke = {
    strokeColor: POLYGON_STYLES.STROKE_COLOR,
    strokeWeight: POLYGON_STYLES.STROKE_WEIGHT,
    strokeOpacity: 0.8,
  };

  return {
    style: {
      fillColor,
      fillOpacity: POLYGON_STYLES.DEFAULT_FILL_OPACITY,
      ...baseStroke,
    },
    hoverStyle: {
      fillColor,
      fillOpacity: 0.6,
      ...baseStroke,
    },
    clickStyle: {
      fillColor,
      fillOpacity: 0.8,
      ...baseStroke,
    },
  };
}

/**
 * GeoJSON 좌표 배열을 카카오 지도 폴리곤 path 형식으로 변환
 * - GeoJSON은 [lng, lat] 순서, 카카오 지도는 LatLng(lat, lng) 순서
 * - Polygon: 단일 폴리곤 (외곽선 + 구멍들)
 * - MultiPolygon: 여러 개의 분리된 폴리곤 (섬 지역 등)
 * @param coordinates - GeoJSON 좌표 배열
 * @param geometryType - "Polygon" 또는 "MultiPolygon"
 * @returns 카카오 지도 Polygon에 전달할 path 배열
 */
export function convertCoordinatesToPaths(
  coordinates: number[][][] | number[][][][],
  geometryType: "Polygon" | "MultiPolygon"
): kakao.maps.LatLng[][] {
  const paths: kakao.maps.LatLng[][] = [];

  if (geometryType === "Polygon") {
    const rings = coordinates as number[][][];
    for (const ring of rings) {
      const path: kakao.maps.LatLng[] = ring.map(
        ([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)
      );
      paths.push(path);
    }
  } else {
    const polygons = coordinates as number[][][][];
    for (const polygon of polygons) {
      for (const ring of polygon) {
        const path: kakao.maps.LatLng[] = ring.map(
          ([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)
        );
        paths.push(path);
      }
    }
  }

  return paths;
}

/**
 * 카카오 지도 Polygon 객체에 스타일 적용
 * - 호버/클릭 등 상태 변경 시 스타일 업데이트에 사용
 * @param polygon - 카카오 지도 Polygon 인스턴스
 * @param style - 적용할 PolygonStyle 객체
 */
export function applyStyle(
  polygon: kakao.maps.Polygon,
  style: PolygonStyle
): void {
  polygon.setOptions({
    fillColor: style.fillColor,
    fillOpacity: style.fillOpacity,
    strokeColor: style.strokeColor,
    strokeWeight: style.strokeWeight,
    strokeOpacity: style.strokeOpacity,
  });
}

export function getRegionPrefix(address: string): string {
  const parts = address.split(" ");
  return parts[parts.length - 1];
}

/**
 * 카테고리 코드에 해당하는 SVG 마커 이미지 생성
 * @param categoryCode - 카카오 카테고리 코드 (예: "CE7", "FD6")
 * @returns data URL 형식의 SVG 이미지
 */
export function createMarkerSvg(categoryCode: string): string {
  const icon = CATEGORY_ICONS[categoryCode];
  const color = icon?.color || "#444";
  const path = icon?.path || "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"; // 기본 원

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 7.5 12 18 12 18s12-10.5 12-18C24 5.37 18.63 0 12 0z" fill="${color}" filter="url(#shadow)"/>
      <circle cx="12" cy="10.5" r="8" fill="white"/>
      <g transform="translate(4, 2.5) scale(0.667)">
        <path d="${path}" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"/>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Feature 바운딩 박스의 중심 좌표 계산
 * @param feature - GeoJSON Feature 객체
 * @returns 중심점의 위도/경도
 */
export function getFeatureCenter(feature: GeoJSONFeature): { lat: number; lng: number } {
  const bounds = getFeatureBounds(feature);
  return {
    lat: (bounds.minLat + bounds.maxLat) / 2,
    lng: (bounds.minLng + bounds.maxLng) / 2,
  };
}

/**
 * Haversine 공식으로 두 좌표 간 거리 계산
 * @param lat1 - 시작점 위도
 * @param lng1 - 시작점 경도
 * @param lat2 - 끝점 위도
 * @param lng2 - 끝점 경도
 * @returns 거리 (미터)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 지구 반지름 (미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Feature 바운딩 박스에서 검색 반경 계산
 * - 중심에서 모서리까지의 거리를 반경으로 사용
 * @param feature - GeoJSON Feature 객체
 * @returns 반경 (미터, 반올림)
 */
export function getFeatureRadius(feature: GeoJSONFeature): number {
  const bounds = getFeatureBounds(feature);
  const center = getFeatureCenter(feature);
  const radius = calculateDistance(
    center.lat,
    center.lng,
    bounds.maxLat,
    bounds.maxLng
  );
  return Math.round(radius);
}
