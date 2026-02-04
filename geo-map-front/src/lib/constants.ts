/**
 * 지도 기본 설정
 */
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 37.5665, lng: 126.978 },
  DEFAULT_ZOOM: 11,
} as const;

/**
 * 줌 레벨별 행정구역 표시 기준
 * - sido: 시/도 레벨 (0~9)
 * - sgg: 시군구 레벨 (10~12)
 * - dong: 동 레벨 (13~21)
 */
export const ZOOM_LEVELS = {
  SIDO: { min: 0, max: 9 },
  SGG: { min: 10, max: 12 },
  DONG: { min: 13, max: 21 },
} as const;

/**
 * 폴리곤 스타일 설정
 */
export const POLYGON_STYLES = {
  DEFAULT_FILL_OPACITY: 0.4,
  SELECTED_FILL_OPACITY: 0.7,
  STROKE_COLOR: "#FFFFFF",
  STROKE_WEIGHT: 2,
} as const;

/**
 * 시/도 색상 매핑 (sido 코드 기준)
 */
export const SIDO_COLORS: Record<string, string> = {
  "11": "#FF6B6B", // 서울특별시
  "26": "#4ECDC4", // 부산광역시
  "27": "#45B7D1", // 대구광역시
  "28": "#96CEB4", // 인천광역시
  "29": "#FFEAA7", // 광주광역시
  "30": "#DDA0DD", // 대전광역시
  "31": "#98D8C8", // 울산광역시
  "36": "#F7DC6F", // 세종특별자치시
  "41": "#BB8FCE", // 경기도
  "42": "#85C1E9", // 강원도
  "43": "#F8B500", // 충청북도
  "44": "#82E0AA", // 충청남도
  "45": "#F1948A", // 전라북도
  "46": "#85929E", // 전라남도
  "47": "#73C6B6", // 경상북도
  "48": "#F5B041", // 경상남도
  "50": "#AF7AC5", // 제주특별자치도
} as const;

/**
 * 해시 기반 색상 생성용 팔레트 (sgg 코드용)
 */
export const SGG_PALETTE = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8B500", "#82E0AA", "#F1948A", "#85929E", "#73C6B6",
  "#F5B041", "#AF7AC5", "#5DADE2", "#58D68D", "#EC7063",
  "#A569BD", "#48C9B0", "#5499C7", "#52BE80", "#F4D03F",
] as const;

/**
 * Naver Maps 이벤트명
 */
export const NAVER_MAP_EVENTS = {
  // Map 이벤트
  BOUNDS_CHANGED: "bounds_changed",
  ZOOM_CHANGED: "zoom_changed",
  // Polygon/Overlay 이벤트
  CLICK: "click",
  MOUSEOVER: "mouseover",
  MOUSEOUT: "mouseout",
} as const;

export const DISPLAY_COUNT = 10;
export const MAX_START = 1000;

// ========================================
// Kakao Maps 설정
// ========================================

/**
 * 카카오 지도 기본 설정
 * - level: 낮을수록 확대 (1=최대확대, 14=최대축소)
 */
export const KAKAO_MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 37.5665, lng: 126.978 },
  DEFAULT_LEVEL: 8,
  MIN_LEVEL: 1,
  MAX_LEVEL: 14,
} as const;

/**
 * 카카오 지도 레벨별 행정구역 표시 기준
 * - level은 낮을수록 확대됨 (네이버 zoom과 반대)
 * - sido: 시/도 레벨 (12~14)
 * - sgg: 시군구 레벨 (9~11)
 * - dong: 동 레벨 (1~8)
 */
export const KAKAO_ZOOM_LEVELS = {
  SIDO: { min: 12, max: 14 },
  SGG: { min: 9, max: 11 },
  DONG: { min: 1, max: 8 },
} as const;

/**
 * Kakao Maps 이벤트명
 */
export const KAKAO_MAP_EVENTS = {
  // Map 이벤트
  BOUNDS_CHANGED: "bounds_changed",
  ZOOM_CHANGED: "zoom_changed",
  // Polygon/Overlay 이벤트
  CLICK: "click",
  MOUSEOVER: "mouseover",
  MOUSEOUT: "mouseout",
} as const;