"use client";

import { useSearchParams } from "next/navigation";
import { Info, Share2 } from "lucide-react";
import { useShallow } from "zustand/shallow";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import useGetKakaoPlacesSearch from "@/hooks/kakao/useGetKakaoPlacesSearch";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import PlaceSearchForm from "./PlaceSearchForm";
import PlaceSearchList from "./PlaceSearchList";

const USAGE_GUIDE = [
  {
    label: "줌 레벨",
    description: (level: number) => `현재 ${level} (10~12: 시/도, 7~9: 시군구)`,
  },
  { label: "지도 영역", description: "드래그로 이동, 스크롤로 확대/축소" },
  { label: "폴리곤 클릭", description: "시/도 → 확대, 시군구 → 검색 시작" },
  {
    label: "장소 검색",
    description: "키워드 입력 후 현재 지도 중심 기준 검색",
  },
] as const;

/**
 * PlaceSearchLayout
 *
 * 역할: 장소 검색 사이드바 컴포넌트
 * - SidebarProvider 내부에서 사용
 * - 데스크톱: 접고 펼 수 있는 사이드바 (Ctrl/Cmd + B)
 * - 모바일: Sheet로 표시
 */
function PlaceSearchLayout() {
  const searchParams = useSearchParams();
  const { places, totalCount } = useGetKakaoPlacesSearch();

  // 현재 검색어
  const query = searchParams.get("query");

  // 현재 줌 레벨 (지도 상태에서 가져옴)
  const { level } = useKakaoMapStore(
    useShallow((state) => ({
      level: state.level,
    }))
  );

  /**
   * 공유하기 핸들러
   */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  return (
    <Sidebar collapsible="offcanvas">
      {/* 헤더 영역 */}
      <SidebarHeader className="border-b p-4">
        {/* 제목 및 버튼들 */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold">{query} 주변 장소 검색</h2>
            {totalCount > 0 && (
              <span className="text-muted-foreground text-xs">
                {places.length}/{totalCount}건
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleShare}
            aria-label="링크 공유하기"
          >
            <Share2 className="size-4" />
          </Button>
        </div>

        {/* 설명: 기능 안내 (accordion) */}
        <Accordion type="single" collapsible>
          <AccordionItem value="usage-guide" className="border-none">
            <AccordionTrigger className="text-muted-foreground py-2 text-xs hover:no-underline">
              <span className="flex items-center gap-1">
                <Info size={10} />
                사용 방법 보기
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
                {USAGE_GUIDE.map(({ label, description }) => (
                  <div key={label} className="contents">
                    <dt className="flex items-center gap-1 font-medium text-gray-700">
                      <Info size={10} />
                      {label}
                    </dt>
                    <dd className="text-left">
                      {typeof description === "function"
                        ? description(level)
                        : description}
                    </dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* 검색 폼 */}
        <PlaceSearchForm />
      </SidebarHeader>

      {/* 검색 결과 리스트 */}
      <SidebarContent>
        <PlaceSearchList />
      </SidebarContent>
    </Sidebar>
  );
}

export default PlaceSearchLayout;
