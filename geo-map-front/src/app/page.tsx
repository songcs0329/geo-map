import KakaoPolygonMap from "@/components/layout/KakaoPolygonMap";
import PlaceSearchPanel from "@/components/layout/PlaceSearchPanel";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      {/* 배경: 카카오 지도 (모든 페이지에서 공유) */}
      <Suspense fallback={null}>
        <KakaoPolygonMap />
        <PlaceSearchPanel />
      </Suspense>
    </div>
  );
}
