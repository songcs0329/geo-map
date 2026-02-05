"use client";

import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

export default function useKakaoLoader() {
  const [loading, error] = useKakaoLoaderOrigin({
    appkey: KAKAO_JS_KEY || "",
    libraries: ["services"],
  });

  return {
    loading,
    error,
  };
}
