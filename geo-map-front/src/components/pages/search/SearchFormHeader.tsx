"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useSearchForm, { SearchFormData } from "@/hooks/search/useSearchForm";
import { Controller, FormProvider } from "react-hook-form";
import { SearchIcon, Share2Icon } from "lucide-react";
import { copyCurrentPageUrl } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRegionPrefix } from "@/lib/geoUtils";

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
  const { formState, handleSubmit, control } = methods;

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
            <Field orientation="horizontal" className="gap-0">
              <FieldLabel htmlFor="search-form-keyword" className="w-20">
                키워드
              </FieldLabel>
              <Controller
                name="keyword"
                control={control}
                render={({ field }) => (
                  <>
                    <InputGroup className="overflow-hidden">
                      <InputGroupInput
                        id="search-form-keyword"
                        placeholder="키워드 입력"
                        aria-invalid={!!formState.errors.keyword}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                      <InputGroupAddon
                        align="inline-start"
                        className="bg-gray-200 px-3 py-2"
                      >
                        {getRegionPrefix(address)}
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <SearchIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </>
                )}
              />
            </Field>
            <Field orientation="horizontal" className="gap-0">
              <FieldLabel htmlFor="search-form-sort" className="w-20">
                정렬 기준
              </FieldLabel>
              <Controller
                name="sort"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="search-form-sort" className="w-full">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field orientation="horizontal" className="justify-end">
              <Button type="submit">검색</Button>
            </Field>
          </FieldGroup>
        </form>
      </DrawerHeader>
    </FormProvider>
  );
}

export default SearchFormHeader;
