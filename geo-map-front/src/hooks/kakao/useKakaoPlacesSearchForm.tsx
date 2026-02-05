"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type {
  PlaceSearchSort,
  CategoryGroupCode,
} from "@/types/kakao-places.types";

/**
 * 카카오 장소 검색 폼 스키마
 * - query: 검색어 (필수)
 * - category_group_code: 카테고리 필터 (선택)
 * - x: 중심 좌표 경도 (선택)
 * - y: 중심 좌표 위도 (선택)
 * - sort: 정렬 방식 (정확도순 | 거리순)
 */
const placeSearchSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요"),
  category_group_code: z.string().optional(),
  x: z.string().optional(),
  y: z.string().optional(),
  sort: z.enum(["accuracy", "distance"]).default("accuracy"),
});

export type PlaceSearchFormData = z.infer<typeof placeSearchSchema>;

/**
 * useKakaoPlacesSearchForm
 *
 * 역할: 카카오 장소 검색 폼 상태 관리 훅
 * - zod 스키마로 폼 유효성 검사
 * - react-hook-form으로 폼 상태 관리
 * - searchParams에서 초기값 추출
 * - onSubmit 시 router.push로 searchParams 업데이트 (page, size 제외)
 *
 * @returns form - react-hook-form 객체 (register, handleSubmit, formState 등)
 * @returns onSubmit - 폼 제출 핸들러 (searchParams 업데이트)
 * @returns searchValues - 현재 searchParams 값들
 */
function useKakaoPlacesSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // searchParams에서 현재 값 추출
  const searchValues = {
    query: searchParams.get("query") ?? "",
    category_group_code:
      (searchParams.get("category_group_code") as CategoryGroupCode) ??
      undefined,
    x: searchParams.get("x") ?? undefined,
    y: searchParams.get("y") ?? undefined,
    sort: (searchParams.get("sort") as PlaceSearchSort) ?? "accuracy",
  };

  // react-hook-form 초기화
  const form = useForm<PlaceSearchFormData>({
    resolver: standardSchemaResolver(placeSearchSchema),
    defaultValues: {
      query: searchValues.query,
      category_group_code: searchValues.category_group_code,
      x: searchValues.x,
      y: searchValues.y,
      sort: searchValues.sort,
    },
  });

  // searchParams 변경 시 폼 값 동기화
  useEffect(() => {
    form.reset({
      query: searchValues.query,
      category_group_code: searchValues.category_group_code,
      x: searchValues.x,
      y: searchValues.y,
      sort: searchValues.sort,
    });
  }, [searchParams]);

  /**
   * 폼 제출 핸들러
   * - 유효한 값만 searchParams에 추가
   * - page, size는 제외 (리스트에서 관리)
   */
  const onSubmit = useCallback(
    (data: PlaceSearchFormData) => {
      const params = new URLSearchParams();

      // 필수값: query
      if (data.query) {
        params.set("query", data.query);
      }

      // 선택값: category_group_code
      if (data.category_group_code) {
        params.set("category_group_code", data.category_group_code);
      }

      // 좌표값: x, y
      if (data.x) {
        params.set("x", data.x);
      }
      if (data.y) {
        params.set("y", data.y);
      }

      // 정렬: sort (기본값 accuracy는 생략 가능)
      if (data.sort && data.sort !== "accuracy") {
        params.set("sort", data.sort);
      }

      router.push(`/?${params.toString()}`);
    },
    [router]
  );

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    searchValues,
  };
}

export default useKakaoPlacesSearchForm;
