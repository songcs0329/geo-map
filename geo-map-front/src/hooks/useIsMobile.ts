"use client";

import { useState, useEffect } from "react";
import { MOBILE_BREAKPOINT } from "@/lib/constants";

/**
 * useIsMobile
 *
 * 화면 크기가 모바일 브레이크포인트(768px) 이하인지 감지하는 훅
 * - SSR에서는 undefined 반환 (hydration mismatch 방지)
 * - 클라이언트 마운트 후 실제 값 반환
 * - resize 이벤트로 실시간 감지
 */
function useIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // 초기 체크
    checkMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export default useIsMobile;
