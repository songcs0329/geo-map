import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchBlog } from "@/lib/apis/search";
import { DISPLAY_COUNT, MAX_START } from "@/lib/constants";
import { UseGetSearchFormOptions } from "./useSearchForm";

function useGetSearchBlog({
  keyword,
  sort = "sim",
  enabled = true,
}: UseGetSearchFormOptions) {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", "blog", keyword, sort],
    queryFn: ({ pageParam = 1 }) =>
      getSearchBlog({
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

export default useGetSearchBlog;
