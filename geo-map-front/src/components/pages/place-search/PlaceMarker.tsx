import type { KakaoPlace } from "@/types/kakao-places.types";
import { memo, useCallback, useMemo } from "react";
import { MapMarker } from "react-kakao-maps-sdk";

/**
 * 카테고리별 Lucide 아이콘 SVG path
 * - 24x24 기준 path data
 */
const CATEGORY_ICONS: Record<string, { path: string; color: string }> = {
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
};

/**
 * SVG 마커 이미지 생성
 */
function createMarkerSvg(categoryCode: string): string {
  const icon = CATEGORY_ICONS[categoryCode];
  const color = icon?.color || "#444";
  const path = icon?.path || "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"; // 기본 원

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.16 0 0 7.16 0 16c0 10 16 24 16 24s16-14 16-24C32 7.16 24.84 0 16 0z" fill="${color}" filter="url(#shadow)"/>
      <circle cx="16" cy="14" r="11" fill="white"/>
      <g transform="translate(4, 2)">
        <path d="${path}" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"/>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 메모이제이션된 장소 마커 컴포넌트
 * - places 배열이 변경되더라도 개별 마커는 props가 같으면 리렌더링 방지
 */
interface PlaceMarkerProps {
  place: KakaoPlace;
  onSelect: (place: KakaoPlace) => void;
}

const PlaceMarker = memo(function PlaceMarker({
  place,
  onSelect,
}: PlaceMarkerProps) {
  const handleClick = useCallback(() => {
    onSelect(place);
  }, [place, onSelect]);

  const markerImage = useMemo(() => {
    const categoryCode = place.category_group_code;
    return {
      src: createMarkerSvg(categoryCode),
      size: { width: 24, height: 30 },
      options: {
        offset: { x: 12, y: 30 },
      },
    };
  }, [place.category_group_code]);

  return (
    <MapMarker
      title={place.place_name}
      position={{ lat: Number(place.y), lng: Number(place.x) }}
      onClick={handleClick}
      image={markerImage}
    />
  );
});

export default PlaceMarker;
