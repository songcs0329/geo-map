"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useSearchForm, { SearchFormData } from "@/hooks/useSearchForm";
import { Controller, FormProvider } from "react-hook-form";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SearchFormHeaderProps = {
  regionPrefix: string;
};

function SearchFormHeader(props: SearchFormHeaderProps) {
  const { regionPrefix } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const methods = useSearchForm();
  const { formState, handleSubmit, control } = methods;

  const onSubmit = (data: SearchFormData) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <FormProvider {...methods}>
      <DrawerHeader className="sticky top-0 z-10">
        <DrawerTitle>검색 폼</DrawerTitle>
        <DrawerDescription>검색 키워드, 유사도 선택</DrawerDescription>

        <form
          className="flex flex-col gap-1.5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-y-4">
            <Field className="gap-y-1.5">
              <FieldLabel htmlFor="search-form-keyword">
                키워드<span className="text-destructive">*</span>
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
                        {regionPrefix}
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <SearchIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                    {formState.errors.keyword && (
                      <FieldError>
                        {formState.errors.keyword.message}
                      </FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field className="gap-y-1.5">
              <FieldLabel htmlFor="search-form-sort">정렬 기준</FieldLabel>
              <Controller
                name="sort"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === "none") {
                        field.onChange("");
                      } else {
                        field.onChange(value);
                      }
                    }}
                  >
                    <SelectTrigger id="search-form-sort">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">선택</SelectItem>
                        <SelectItem value="sim">정확도순</SelectItem>
                        <SelectItem value="date">날짜순</SelectItem>
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
