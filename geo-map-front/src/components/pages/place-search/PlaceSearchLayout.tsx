"use client";

import { useSearchParams } from "next/navigation";
import { Share2 } from "lucide-react";
import { useShallow } from "zustand/shallow";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import useGetKakaoPlacesSearch from "@/hooks/kakao/useGetKakaoPlacesSearch";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import PlaceSearchForm from "./PlaceSearchForm";
import PlaceSearchList from "./PlaceSearchList";

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

  return (
    <Drawer open direction="left" modal={false}>
      <DrawerContent className="h-full w-80 sm:max-w-80">
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

          {/* 설명: 줌 레벨 안내 포함 */}
          <DrawerDescription className="mt-1 text-xs">
            카카오 장소 검색 API를 사용합니다.
            <br />
            <span className="text-muted-foreground/70">
              현재 줌 레벨: {level} (시군구 영역 클릭 시 검색)
            </span>
          </DrawerDescription>

          {/* 검색 폼 */}
          <div className="mt-4">
            <PlaceSearchForm />
          </div>
        </DrawerHeader>

        {/* 검색 결과 리스트 */}
        <PlaceSearchList />
      </DrawerContent>
    </Drawer>
  );
}

export default PlaceSearchLayout;
