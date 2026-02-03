import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

export type SearchFormSort = "sim" | "date";

export const searchFormSchema = z.object({
  keyword: z.string(),
  sort: z.enum(["sim", "date"]),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;

export interface UseGetSearchFormOptions extends SearchFormData {
  enabled?: boolean;
}

function useSearchForm() {
  const searchParams = useSearchParams();

  const methods = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keyword: searchParams.get("keyword") ?? "",
      sort: (searchParams.get("sort") as SearchFormSort) ?? "sim",
    },
  });

  return methods;
}

export default useSearchForm;
