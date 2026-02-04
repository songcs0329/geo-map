"use client";

import { Info, X, Map, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import useIsOpenToggle from "@/hooks/useIsOpenToggle";

export default function WelcomeTooltip() {
  const { isOpen, handleToggleIsOpen } = useIsOpenToggle(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleIsOpen}
        className="rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
        aria-label="도움말 보기"
      >
        <Info className="text-muted-foreground size-4" />
      </Button>
    );
  }

  return (
    <Card className="w-85 gap-3 bg-white/95 py-4 shadow-lg backdrop-blur-sm">
      <CardHeader className="gap-1 pb-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Map className="text-primary size-4" />
          행정구역 기반 지도 시각화
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleToggleIsOpen}
            aria-label="도움말 닫기"
          >
            <X className="text-muted-foreground size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-2 pt-0 text-sm">
        <div className="flex items-start gap-2">
          <Map className="text-chart-1 mt-0.5 size-4 shrink-0" />
          <p>
            <span className="text-foreground font-medium">줌 인/아웃</span>
            으로 시/도 → 시군구 → 동 전환
          </p>
        </div>
        <div className="flex items-start gap-2">
          <MousePointerClick className="text-chart-2 mt-0.5 size-4 shrink-0" />
          <p>
            <span className="text-foreground font-medium">동 클릭</span>
            으로 지역 검색 (뉴스, 장소, 블로그, 카페)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
