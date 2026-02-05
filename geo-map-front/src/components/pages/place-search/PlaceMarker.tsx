import type { KakaoPlace } from "@/types/kakao-places.types";
import { memo, useCallback, useMemo } from "react";
import { MapMarker } from "react-kakao-maps-sdk";
import { createMarkerSvg } from "@/lib/kakaoMapUtils";

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
