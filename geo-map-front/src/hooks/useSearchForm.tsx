import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const searchFormSchema = z.object({
  keyword: z.string().min(2, "검색어는 최소 2자 이상이어야 합니다."),
  sort: z.enum(["", "sim", "date"]),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;

function useSearchForm() {
  const methods = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keyword: "",
      sort: "",
    },
  });

  return methods;
}

export default useSearchForm;
