"use client";

import { Search } from "lucide-react";
import useKakaoPlacesSearchForm from "@/hooks/kakao/useKakaoPlacesSearchForm";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PLACE_SORT_OPTIONS } from "@/lib/constants";

/**
 * 카테고리 그룹 옵션
 * - 카카오 Places API에서 지원하는 카테고리 코드
 */
const CATEGORY_OPTIONS = [
  { value: "MT1", label: "대형마트" },
  { value: "CS2", label: "편의점" },
  { value: "PS3", label: "어린이집/유치원" },
  { value: "SC4", label: "학교" },
  { value: "AC5", label: "학원" },
  { value: "PK6", label: "주차장" },
  { value: "OL7", label: "주유소/충전소" },
  { value: "SW8", label: "지하철역" },
  { value: "BK9", label: "은행" },
  { value: "CT1", label: "문화시설" },
  { value: "AG2", label: "중개업소" },
  { value: "PO3", label: "공공기관" },
  { value: "AT4", label: "관광명소" },
  { value: "AD5", label: "숙박" },
  { value: "FD6", label: "음식점" },
  { value: "CE7", label: "카페" },
  { value: "HP8", label: "병원" },
  { value: "PM9", label: "약국" },
] as const;

/**
 * PlaceSearchForm
 *
 * 역할: 카카오 장소 검색 폼 UI 컴포넌트
 * - useKakaoPlacesSearchForm 훅으로 폼 상태 관리
 * - 검색어(query), 카테고리, 정렬 방식 입력
 * - onSubmit 시 searchParams 업데이트하여 검색 트리거
 *
 * 폼 필드:
 * - query: 검색어 (필수, 없으면 버튼 비활성화)
 * - category_group_code: 카테고리 필터 (선택)
 * - sort: 정렬 방식 (정확도순/거리순)
 */
function PlaceSearchForm() {
  const { form, onSubmit } = useKakaoPlacesSearchForm();
  const { register, watch, setValue, formState } = form;

  // query 값 감시 (버튼 활성화/비활성화용)
  const queryValue = watch("query");
  const isSubmitDisabled = !queryValue || queryValue.trim().length === 0;

  return (
    <form onSubmit={onSubmit} className="flex flex-row gap-3">
      <div className="flex flex-1 flex-col gap-2">
        {/* 검색어 입력 */}
        <Input
          {...register("query")}
          placeholder="장소를 검색하세요"
          aria-invalid={!!formState.errors.query}
        />

        {/* 폼 에러 메시지 */}
        {formState.errors.query && (
          <p className="text-destructive text-sm">
            {formState.errors.query.message}
          </p>
        )}

        {/* 카테고리 및 정렬 필터 */}
        <div className="flex gap-2">
          {/* 카테고리 선택 */}
          <Select
            value={watch("category_group_code") ?? ""}
            onValueChange={(value) =>
              setValue("category_group_code", value || undefined)
            }
          >
            <SelectTrigger className="flex-1" size="sm">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 정렬 방식 */}
          <Select
            value={watch("sort")}
            onValueChange={(value) =>
              setValue("sort", value as "accuracy" | "distance")
            }
          >
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              {PLACE_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        size="icon"
        disabled={isSubmitDisabled}
        aria-label="검색"
      >
        <Search className="size-4" />
      </Button>
    </form>
  );
}

export default PlaceSearchForm;
