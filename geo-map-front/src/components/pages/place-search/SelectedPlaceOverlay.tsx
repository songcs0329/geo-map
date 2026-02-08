"use client";

import { memo, useCallback } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { Phone, ExternalLink, X, MapPin } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import type { KakaoPlace } from "@/types/kakao-places.types";

interface SelectedPlaceOverlayProps {
  place: KakaoPlace;
  onClose: () => void;
}

/**
 * 선택된 장소 정보 오버레이
 * - 마커 클릭 시 표시되는 장소 상세 정보 카드
 */
const SelectedPlaceOverlay = memo(function SelectedPlaceOverlay({
  place,
  onClose,
}: SelectedPlaceOverlayProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <CustomOverlayMap
      position={{
        lat: Number(place.y),
        lng: Number(place.x),
      }}
      yAnchor={1.4}
    >
      <Item
        variant="outline"
        size="sm"
        className="bg-background relative w-64 shadow-lg"
      >
        {/* 장소 정보 */}
        <ItemContent>
          <div className="flex items-center justify-between gap-2">
            <ItemTitle className="truncate">{place.place_name}</ItemTitle>
            {/* 액션 버튼들 */}
            <ItemActions>
              {place.place_url && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  asChild
                  aria-label="카카오맵에서 보기"
                >
                  <a
                    href={place.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleClose}
                aria-label="닫기"
              >
                <X className="size-3.5" />
              </Button>
            </ItemActions>
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <MapPin className="size-3" />
            <span>{place.road_address_name || place.address_name}</span>
          </div>
          {place.phone && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Phone className="size-3" />
              <span>{place.phone}</span>
            </div>
          )}
        </ItemContent>
      </Item>
    </CustomOverlayMap>
  );
});

export default SelectedPlaceOverlay;
