"use client"

import { useState } from "react"
import { Info, X, Map, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card"

export default function WelcomeTooltip() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"
          aria-label="도움말 보기"
        >
          <Info className="size-4 text-muted-foreground" />
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <Card className="w-72 bg-white/95 backdrop-blur-sm shadow-lg py-4 gap-3">
        <CardHeader className="pb-0 gap-1">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Map className="size-4 text-primary" />
            행정구역 기반 지도 시각화
          </CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsOpen(false)}
              aria-label="도움말 닫기"
            >
              <X className="size-3.5 text-muted-foreground" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Map className="size-4 mt-0.5 shrink-0 text-chart-1" />
            <p>
              <span className="font-medium text-foreground">줌 인/아웃</span>
              으로 시/도 → 시군구 → 동 전환
            </p>
          </div>
          <div className="flex items-start gap-2">
            <MousePointerClick className="size-4 mt-0.5 shrink-0 text-chart-2" />
            <p>
              <span className="font-medium text-foreground">동 클릭</span>
              으로 지역 검색 (뉴스, 장소, 블로그, 카페)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
