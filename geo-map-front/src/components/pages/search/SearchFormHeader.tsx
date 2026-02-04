"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { FieldGroup } from "@/components/ui/field";
import useSearchForm, { SearchFormData } from "@/hooks/search/useSearchForm";
import { FormProvider } from "react-hook-form";
import { Search, Share2Icon } from "lucide-react";
import { copyCurrentPageUrl } from "@/lib/utils";
import { getRegionPrefix } from "@/lib/geoUtils";
import { InputFormField } from "@/components/forms/InputFormField";
import { SelectFormField } from "@/components/forms/SelectFormField";
import { Badge } from "@/components/ui/badge";

const SORT_OPTIONS = [
  { value: "sim", label: "정확도순" },
  { value: "date", label: "날짜순" },
] as const;

type SearchFormHeaderProps = {
  address: string;
};

function SearchFormHeader(props: SearchFormHeaderProps) {
  const { address } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const methods = useSearchForm();
  const { handleSubmit, control } = methods;

  const onSubmit = (data: SearchFormData) => {
    const submitParams = new URLSearchParams(searchParams.toString());

    if (data.keyword) {
      submitParams.set("keyword", data.keyword);
    } else {
      submitParams.delete("keyword");
    }

    if (data.sort) {
      submitParams.set("sort", data.sort);
    } else {
      submitParams.delete("sort");
    }

    router.push(`${pathname}?${submitParams.toString()}`);
  };

  return (
    <FormProvider {...methods}>
      <DrawerHeader className="sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <DrawerTitle>{address}</DrawerTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={copyCurrentPageUrl}
            aria-label="공유하기"
          >
            <Share2Icon className="h-4 w-4" />
          </Button>
        </div>
        <DrawerDescription>
          해당 지역의 뉴스, 장소, 블로그, 카페 정보를 검색합니다.
        </DrawerDescription>

        <hr />

        <form
          className="flex flex-col gap-1.5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-y-3">
            <InputFormField
              control={control}
              name="keyword"
              label="키워드"
              id="search-form-keyword"
              placeholder="키워드 입력"
              prefix={
                <Badge variant="secondary">{getRegionPrefix(address)}</Badge>
              }
              suffix={<Search className="text-muted-foreground" />}
            />

            <SelectFormField
              control={control}
              name="sort"
              label="정렬 기준"
              id="search-form-sort"
              placeholder="선택"
              options={SORT_OPTIONS}
            />
          </FieldGroup>
          <Button type="submit" className="ml-auto justify-end">
            검색
          </Button>
        </form>
      </DrawerHeader>
    </FormProvider>
  );
}

export default SearchFormHeader;
