import { Suspense } from "react";
import KakaoPolygonMap from "@/components/layout/KakaoPolygonMap";
import PlaceSearchLayout from "@/components/pages/place-search/PlaceSearchLayout";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 배경: 카카오 지도 (모든 페이지에서 공유) */}
      <Suspense fallback={null}>
        <KakaoPolygonMap />
        <PlaceSearchLayout />
      </Suspense>
    </div>
  );
}
