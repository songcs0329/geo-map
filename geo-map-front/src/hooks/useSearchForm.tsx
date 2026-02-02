import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

export const searchFormSchema = z.object({
  keyword: z.string().min(2, "검색어는 최소 2자 이상이어야 합니다."),
  sort: z.enum(["sim", "date"]),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;

function useSearchForm() {
  const searchParams = useSearchParams();

  const methods = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keyword: searchParams.get("keyword") ?? "",
      sort: (searchParams.get("sort") as "sim" | "date") ?? "sim",
    },
  });

  return methods;
}

export default useSearchForm;
