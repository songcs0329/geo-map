import { KAKAO_MAP_CONFIG } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * 초기 렌더링 시 searchParams에서 지도 옵션을 읽어오는 훅
 * - useState 초기화 함수를 사용하여 최초 마운트 시의 값만 유지
 * - 이후 searchParams가 변경되어도 초기값 유지
 */
function useInitSearchParamsMapOptions() {
  const searchParams = useSearchParams();

  // useState의 초기화 함수는 최초 렌더링 시에만 실행됨
  const [initialValues] = useState(() => {
    const mapX = searchParams.get("mapX");
    const mapY = searchParams.get("mapY");
    const level = searchParams.get("level");

    return {
      mapCenter:
        mapX && mapY
          ? { lat: parseFloat(mapY), lng: parseFloat(mapX) }
          : KAKAO_MAP_CONFIG.DEFAULT_CENTER,
      mapLevel: level ? parseInt(level, 10) : KAKAO_MAP_CONFIG.DEFAULT_LEVEL,
    };
  });

  return initialValues;
}

export default useInitSearchParamsMapOptions;
