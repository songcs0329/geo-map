import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchFormData } from "./useSearchForm";
import { getSearchCafe } from "@/lib/apis/search";
import { DISPLAY_COUNT, MAX_START } from "@/lib/constants";

interface UseGetSearchCafeOptions extends SearchFormData {
  enabled?: boolean;
}

function useGetSearchCafe({ keyword, sort = "sim", enabled = true }: UseGetSearchCafeOptions) {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", "cafe", keyword, sort],
    queryFn: ({ pageParam = 1 }) =>
      getSearchCafe({
        query: keyword,
        display: DISPLAY_COUNT,
        start: pageParam,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextStart = lastPage.start + lastPage.display;
      if (nextStart > lastPage.total || nextStart > MAX_START) {
        return undefined;
      }
      return nextStart;
    },
    enabled: enabled && !!keyword && keyword.length >= 2,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return {
    items,
    total,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}

export default useGetSearchCafe;
