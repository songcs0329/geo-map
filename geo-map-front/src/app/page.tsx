import { Suspense } from "react";
import KakaoPolygonMap from "@/components/layout/KakaoPolygonMap";
import PlaceSearchLayout from "@/components/pages/place-search/PlaceSearchLayout";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      {/* 사이드바: 장소 검색 */}
      <Suspense fallback={null}>
        <PlaceSearchLayout />
      </Suspense>

      {/* 메인 콘텐츠: 카카오 지도 */}
      <SidebarInset className="relative h-screen">
        <Suspense fallback={null}>
          {/* 사이드바 토글 버튼 (지도 위 좌측 상단) */}
          <SidebarTrigger className="absolute top-4 left-4 z-10 bg-white shadow-md" />
          <KakaoPolygonMap />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
