/**
 * 지도 기본 설정
 */
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 37.5665, lng: 126.978 },
  DEFAULT_ZOOM: 11,
} as const;

/**
 * 폴리곤 스타일 설정
 */
export const POLYGON_STYLES = {
  DEFAULT_FILL_OPACITY: 0.4,
  SELECTED_FILL_OPACITY: 0.7,
  STROKE_COLOR: "#FFFFFF",
  STROKE_WEIGHT: 1,
  HOVER_STROKE_COLOR: "#000000",
  HOVER_STROKE_WEIGHT: 1,
} as const;

/**
 * 서울시 25개 구 색상 매핑
 */
export const DISTRICT_COLORS: Record<string, string> = {
  종로구: "#FF6B6B",
  중구: "#4ECDC4",
  용산구: "#45B7D1",
  성동구: "#96CEB4",
  광진구: "#FFEAA7",
  동대문구: "#DDA0DD",
  중랑구: "#98D8C8",
  성북구: "#F7DC6F",
  강북구: "#BB8FCE",
  도봉구: "#85C1E9",
  노원구: "#F8B500",
  은평구: "#82E0AA",
  서대문구: "#F1948A",
  마포구: "#85929E",
  양천구: "#73C6B6",
  강서구: "#F5B041",
  구로구: "#AF7AC5",
  금천구: "#5DADE2",
  영등포구: "#58D68D",
  동작구: "#EC7063",
  관악구: "#A569BD",
  서초구: "#48C9B0",
  강남구: "#5499C7",
  송파구: "#52BE80",
  강동구: "#F4D03F",
} as const;

/**
 * 구 코드별 색상 (sgg 코드 앞 5자리 기준)
 */
export const DISTRICT_CODE_COLORS: Record<string, string> = {
  "11110": "#FF6B6B", // 종로구
  "11140": "#4ECDC4", // 중구
  "11170": "#45B7D1", // 용산구
  "11200": "#96CEB4", // 성동구
  "11215": "#FFEAA7", // 광진구
  "11230": "#DDA0DD", // 동대문구
  "11260": "#98D8C8", // 중랑구
  "11290": "#F7DC6F", // 성북구
  "11305": "#BB8FCE", // 강북구
  "11320": "#85C1E9", // 도봉구
  "11350": "#F8B500", // 노원구
  "11380": "#82E0AA", // 은평구
  "11410": "#F1948A", // 서대문구
  "11440": "#85929E", // 마포구
  "11470": "#73C6B6", // 양천구
  "11500": "#F5B041", // 강서구
  "11530": "#AF7AC5", // 구로구
  "11545": "#5DADE2", // 금천구
  "11560": "#58D68D", // 영등포구
  "11590": "#EC7063", // 동작구
  "11620": "#A569BD", // 관악구
  "11650": "#48C9B0", // 서초구
  "11680": "#5499C7", // 강남구
  "11710": "#52BE80", // 송파구
  "11740": "#F4D03F", // 강동구
} as const;
