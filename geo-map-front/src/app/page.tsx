import { Suspense } from "react";
import KakaoPolygonMap from "@/components/layout/KakaoPolygonMap";
import PlaceSearchLayout from "@/components/pages/place-search/PlaceSearchLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <div className="relative h-screen w-full">
          {/* 사이드바: 장소 검색 */}
          <PlaceSearchLayout />
          {/* 메인 콘텐츠: 카카오 지도 */}
          <KakaoPolygonMap />
        </div>
      </Suspense>
    </SidebarProvider>
  );
}
