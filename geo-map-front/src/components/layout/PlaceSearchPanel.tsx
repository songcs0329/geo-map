"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import useKakaoMapStore from "@/stores/useKakaoMapStore";
import { PLACE_SORT_OPTIONS } from "@/lib/constants";

export default function PlaceSearchPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedFeature } = useKakaoMapStore(
    useShallow((state) => ({ selectedFeature: state.selectedFeature }))
  );

  // 검색어: selectedFeature의 adm_nm 마지막 단어
  const keyword = selectedFeature
    ? selectedFeature.properties.adm_nm.split(" ").at(-1) ?? ""
    : "";

  const currentSort = searchParams.get("sort") ?? "accuracy";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  // 선택된 지역 없으면 패널 숨김
  if (!selectedFeature) return null;

  return (
    <div className="absolute right-4 top-4 z-10 w-72 rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-3">
        <label className="text-sm font-medium text-gray-700">검색어</label>
        <input
          type="text"
          value={keyword}
          readOnly
          className="mt-1 w-full rounded-md border bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">정렬</label>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        >
          {PLACE_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
