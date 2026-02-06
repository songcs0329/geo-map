"use client";

import { useSearchParams } from "next/navigation";
import { Info, Share2, ChevronDown } from "lucide-react";
import { useShallow } from "zustand/shallow";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import useGetKakaoPlacesSearch from "@/hooks/kakao/useGetKakaoPlacesSearch";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import useIsMobile from "@/hooks/useIsMobile";
import DesktopDrawer from "./DesktopDrawer";
import MobileDrawer from "./MobileDrawer";
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
 * 역할: 장소 검색 페이지 레이아웃 컴포넌트
 * - 항상 열린 Left Drawer (modal=false, 지도와 상호작용 가능)
 * - DrawerHeader: 제목(검색어 + 총 건수), 설명, 공유 버튼, 검색 폼
 * - DrawerContent: 장소 검색 결과 리스트
 *
 * URL 구조:
 * - 폴리곤 클릭 시: /?query={adm_nm}&x={경도}&y={위도}
 * - 폼 onSubmit 시: /?query=...&x=...&y=...&sort=...&category_group_code=...
 *
 * 줌 레벨 안내:
 * - 시/도 레벨(10~12)에서 폴리곤 클릭하면 시군구 레벨로 이동
 * - 시군구 레벨(7~9)에서 폴리곤 클릭하면 해당 지역 검색 시작
 */
function PlaceSearchLayout() {
  const searchParams = useSearchParams();
  const { places, totalCount } = useGetKakaoPlacesSearch();
  const isMobile = useIsMobile();

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
   * - 현재 URL을 클립보드에 복사
   */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  /**
   * 제목 텍스트 생성
   * - 검색어가 있으면: "{검색어} 주변 장소 (N건)"
   * - 검색어가 없으면: "장소 검색"
   */
  const titleText = query
    ? `${query} 주변 장소${totalCount > 0 ? ` (${places.length}/${totalCount}건)` : ""}`
    : "장소 검색";

  // 마운트 전까지 렌더링 지연 (hydration mismatch 방지)
  if (isMobile === undefined) return null;

  const DrawerWrapper = isMobile ? MobileDrawer : DesktopDrawer;

  const drawerContent = (
    <>
      {/* 헤더 영역: 제목, 설명, 검색 폼 */}
      <DrawerHeader className="border-border border-b pb-4">
        {/* 제목 및 공유 버튼 */}
        <div className="flex items-center justify-between gap-2">
          <DrawerTitle className="text-base">{titleText}</DrawerTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleShare}
            aria-label="링크 공유하기"
          >
            <Share2 className="size-4" />
          </Button>
        </div>

        {/* 설명: 기능 안내 (collapsible) */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground mt-2 flex w-full items-center justify-between px-0 text-xs"
            >
              <span className="flex items-center gap-1">
                <Info size={10} />
                사용 방법 보기
              </span>
              <ChevronDown className="size-4 transition-transform [[data-state=open]>&]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <DrawerDescription asChild className="px-2.5">
              <dl className="text-muted-foreground mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
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
            </DrawerDescription>
          </CollapsibleContent>
        </Collapsible>

        {/* 검색 폼 */}
        <div className="mt-2">
          <PlaceSearchForm />
        </div>
      </DrawerHeader>

      {/* 검색 결과 리스트 */}
      <PlaceSearchList />
    </>
  );

  return <DrawerWrapper>{drawerContent}</DrawerWrapper>;
}

export default PlaceSearchLayout;
