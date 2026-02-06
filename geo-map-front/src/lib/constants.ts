// ========================================
// 반응형 브레이크포인트
// ========================================

export const MOBILE_BREAKPOINT = 768;

// ========================================
// Kakao Maps 설정
// ========================================

/**
 * 폴리곤 스타일 설정
 */
export const POLYGON_STYLES = {
  DEFAULT_FILL_OPACITY: 0.4,
  SELECTED_FILL_OPACITY: 0.7,
  STROKE_COLOR: "#FFFFFF",
  STROKE_WEIGHT: 1,
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
 * 카카오 지도 기본 설정
 * - level: 낮을수록 확대 (1=최대확대, 14=최대축소)
 */
export const KAKAO_MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 37.5665, lng: 126.978 },
  DEFAULT_LEVEL: 12,
  MIN_LEVEL: 7,
  MAX_LEVEL: 12,
} as const;

/**
 * 카카오 지도 레벨별 행정구역 표시 기준
 * - level은 낮을수록 확대됨 (네이버 zoom과 반대)
 * - sido: 시/도 레벨 (10~14)
 * - sgg: 시군구 레벨 (1~9)
 */
export const KAKAO_ZOOM_LEVELS = {
  SIDO: { min: 10, max: 12 },
  SGG: { min: 7, max: 9 },
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

// ========================================
// 카카오 Places API 설정
// ========================================

/**
 * 장소 검색 정렬 옵션
 */
export const PLACE_SORT_OPTIONS = [
  { value: "accuracy", label: "정확도순" },
  { value: "distance", label: "거리순" },
] as const;

export const DEFAULT_PAGE_SIZE = 15;

/**
 * 카테고리별 Lucide 아이콘 SVG path 및 색상
 * - 24x24 기준 path data
 */
export const CATEGORY_ICONS: Record<string, { path: string; color: string }> = {
  MT1: {
    // ShoppingCart - 대형마트
    path: "M2 3h1.5L6 16.5h12M9 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 8h10l-1 5H9L8 8z",
    color: "#F97316",
  },
  CS2: {
    // Store - 편의점
    path: "M2 7l10-4 10 4v5H2zm0 5h20v9H2zm9 0v9m-5-4h10",
    color: "#10B981",
  },
  PS3: {
    // Baby - 어린이집/유치원
    path: "M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5M12 2a10 10 0 0 0-7.35 16.76 2 2 0 0 1 .65 1.49V22h13.4v-1.75a2 2 0 0 1 .65-1.49A10 10 0 0 0 12 2z",
    color: "#EC4899",
  },
  SC4: {
    // GraduationCap - 학교
    path: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 2 2 3 6 3s6-1 6-3v-5",
    color: "#8B5CF6",
  },
  AC5: {
    // BookOpen - 학원
    path: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    color: "#6366F1",
  },
  PK6: {
    // ParkingCircle - 주차장
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9 17V7h4a3 3 0 0 1 0 6H9",
    color: "#3B82F6",
  },
  OL7: {
    // Fuel - 주유소/충전소
    path: "M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17M7 7h6m-3 7v3m8-10v9a2 2 0 0 0 4 0V8a2 2 0 0 0-2-2h-2",
    color: "#EF4444",
  },
  SW8: {
    // Train - 지하철역
    path: "M4 15.5V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10.5M4 15.5a3.5 3.5 0 0 0 3.5 3.5h9a3.5 3.5 0 0 0 3.5-3.5M4 15.5h16M9 19l-2 3m10-3 2 3M8 11h.01M16 11h.01",
    color: "#0EA5E9",
  },
  BK9: {
    // Landmark - 은행
    path: "M3 22h18M6 18v-4m4 4v-4m4 4v-4m4 4v-4M2 10l10-5 10 5H2zm4-2h12v2H6z",
    color: "#14B8A6",
  },
  CT1: {
    // Theater - 문화시설
    path: "M2 10s3-3 10-3 10 3 10 3M12 7V3m-6.25 8c.75 3.5 2.75 7 6.25 7s5.5-3.5 6.25-7M8 21h8m-4-4v4",
    color: "#A855F7",
  },
  AG2: {
    // Home - 중개업소
    path: "M3 10L12 3l9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm6 11v-7h6v7",
    color: "#F59E0B",
  },
  PO3: {
    // Building - 공공기관
    path: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zm-4 0h16m-11-9h2m3 0h2m-7 4h2m3 0h2m-7-8h2m3 0h2",
    color: "#64748B",
  },
  AT4: {
    // Camera - 관광명소
    path: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    color: "#06B6D4",
  },
  AD5: {
    // Bed - 숙박
    path: "M2 4v16m20-8v8M2 12h20M2 8h10a4 4 0 0 1 4 4M6 12v-2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2",
    color: "#7C3AED",
  },
  FD6: {
    // UtensilsCrossed - 음식점
    path: "M16 2v17.85a.5.5 0 0 1-.9.3l-4.1-5.4M8 2v8a4 4 0 0 0 4 4v5M8 2H6a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4m2-10h2",
    color: "#EF4444",
  },
  CE7: {
    // Coffee - 카페
    path: "M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zm0 13h18",
    color: "#92400E",
  },
  HP8: {
    // Hospital - 병원
    path: "M12 6v4m-2 2h4m-9 0H3v6h2m14 0h2v-6h-2M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M3 8h18M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",
    color: "#DC2626",
  },
  PM9: {
    // Pill - 약국
    path: "M10.5 20.5 4 14a5.66 5.66 0 1 1 8-8l6.5 6.5a5.66 5.66 0 0 1-8 8zM8.5 8.5l7 7",
    color: "#22C55E",
  },
} as const;

/**
 * 카테고리 그룹 옵션
 * - 카카오 Places API에서 지원하는 카테고리 코드
 */
export const CATEGORY_OPTIONS = [
  { value: "MT1", label: "대형마트" },
  { value: "CS2", label: "편의점" },
  { value: "PS3", label: "어린이집/유치원" },
  { value: "SC4", label: "학교" },
  { value: "AC5", label: "학원" },
  { value: "PK6", label: "주차장" },
  { value: "OL7", label: "주유소/충전소" },
  { value: "SW8", label: "지하철역" },
  { value: "BK9", label: "은행" },
  { value: "CT1", label: "문화시설" },
  { value: "AG2", label: "중개업소" },
  { value: "PO3", label: "공공기관" },
  { value: "AT4", label: "관광명소" },
  { value: "AD5", label: "숙박" },
  { value: "FD6", label: "음식점" },
  { value: "CE7", label: "카페" },
  { value: "HP8", label: "병원" },
  { value: "PM9", label: "약국" },
] as const;