import type {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  AdminLevel,
  FeatureBounds,
  PolygonStyle,
} from "@/types/map";
import { POLYGON_STYLES, SGG_PALETTE, SIDO_COLORS, ZOOM_LEVELS } from "./constants";

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
 * - sgg, dong: 시군구 코드 기반 해시 색상
 * @param feature - GeoJSON Feature 객체
 * @param adminLevel - 현재 행정 레벨 ("sido" | "sgg" | "dong")
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
    case "dong":
    default:
      return getSggColor(sgg);
  }
}

/**
 * 현재 줌 레벨에 따라 표시할 행정구역 레벨 결정
 * - zoom 0~9: 시/도 (sido) - 17개
 * - zoom 10~12: 시군구 (sgg) - ~250개
 * - zoom 13+: 동 (dong) - ~3,500개
 * @param zoom - 현재 지도 줌 레벨
 * @returns "sido" | "sgg" | "dong"
 */
export function getAdminLevelByZoom(zoom: number): AdminLevel {
  if (zoom <= ZOOM_LEVELS.SIDO.max) {
    return "sido";
  } else if (zoom <= ZOOM_LEVELS.SGG.max) {
    return "sgg";
  } else {
    return "dong";
  }
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
 * @param mapBounds - 현재 지도 화면의 바운딩 박스
 * @returns true면 화면에 보임, false면 화면 밖
 */
export function boundsIntersect(
  featureBounds: FeatureBounds,
  mapBounds: naver.maps.LatLngBounds
): boolean {
  const sw = mapBounds.getSW();
  const ne = mapBounds.getNE();

  const mapMinLat = sw.lat();
  const mapMaxLat = ne.lat();
  const mapMinLng = sw.lng();
  const mapMaxLng = ne.lng();

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
 * @param mapBounds - 현재 지도 화면의 바운딩 박스 (null이면 전체 반환)
 * @returns 화면 내에 보이는 Feature 배열
 */
export function filterFeaturesByBounds(
  features: GeoJSONFeature[],
  mapBounds: naver.maps.LatLngBounds | null
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
  mapBounds: naver.maps.LatLngBounds | null
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
 * GeoJSON 좌표 배열을 네이버 지도 폴리곤 paths 형식으로 변환
 * - GeoJSON은 [lng, lat] 순서, 네이버 지도는 LatLng(lat, lng) 순서
 * - Polygon: 단일 폴리곤 (외곽선 + 구멍들)
 * - MultiPolygon: 여러 개의 분리된 폴리곤 (섬 지역 등)
 * @param coordinates - GeoJSON 좌표 배열
 * @param geometryType - "Polygon" 또는 "MultiPolygon"
 * @returns 네이버 지도 Polygon에 전달할 paths 배열
 */
export function convertCoordinatesToPaths(
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

/**
 * 네이버 지도 Polygon 객체에 스타일 적용
 * - 호버/클릭 등 상태 변경 시 스타일 업데이트에 사용
 * @param polygon - 네이버 지도 Polygon 인스턴스
 * @param style - 적용할 PolygonStyle 객체
 */
export function applyStyle(
  polygon: naver.maps.Polygon,
  style: PolygonStyle
): void {
  const p = polygon as any;
  p.setStyles({
    fillColor: style.fillColor,
    fillOpacity: style.fillOpacity,
    strokeColor: style.strokeColor,
    strokeWeight: style.strokeWeight,
    strokeOpacity: style.strokeOpacity,
  });
}