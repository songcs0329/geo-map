import { useInfiniteQuery } from "@tanstack/react-query";
import { searchNews } from "@/lib/apis/naverSearch";
import { SearchFormSort } from "./useSearchForm";

const DISPLAY_COUNT = 10;
const MAX_START = 1000;

interface UseSearchNewsParams {
  keyword: string;
  sort?: SearchFormSort;
}

function useSearchNews({ keyword, sort = "sim" }: UseSearchNewsParams) {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", "news", keyword, sort],
    queryFn: ({ pageParam = 1 }) =>
      searchNews({
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
    enabled: !!keyword && keyword.length >= 2,
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

export default useSearchNews;
