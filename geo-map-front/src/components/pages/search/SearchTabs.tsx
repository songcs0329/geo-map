"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSearchBlog from "@/hooks/useSearchBlog";
import useSearchNews from "@/hooks/useSearchNews";
import SearchResultList from "./SearchResultList";
import BlogItemCard from "./BlogItemCard";
import NewsItemCard from "./NewsItemCard";

interface SearchTabsProps {
  keyword: string;
  sort: "sim" | "date";
}

function SearchTabs({ keyword, sort }: SearchTabsProps) {
  const blogSearch = useSearchBlog({ keyword, sort });
  const newsSearch = useSearchNews({ keyword, sort });

  if (!keyword || keyword.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        검색어를 2자 이상 입력해주세요.
      </div>
    );
  }

  return (
    <Tabs defaultValue="blog" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="blog">블로그</TabsTrigger>
        <TabsTrigger value="news">뉴스</TabsTrigger>
      </TabsList>
      <TabsContent value="blog" className="mt-4">
        <SearchResultList
          isLoading={blogSearch.isLoading}
          isFetchingNextPage={blogSearch.isFetchingNextPage}
          hasNextPage={blogSearch.hasNextPage ?? false}
          isEmpty={blogSearch.items.length === 0}
          total={blogSearch.total}
          fetchNextPage={blogSearch.fetchNextPage}
        >
          {blogSearch.items.map((item, index) => (
            <BlogItemCard key={`${item.link}-${index}`} item={item} />
          ))}
        </SearchResultList>
      </TabsContent>
      <TabsContent value="news" className="mt-4">
        <SearchResultList
          isLoading={newsSearch.isLoading}
          isFetchingNextPage={newsSearch.isFetchingNextPage}
          hasNextPage={newsSearch.hasNextPage ?? false}
          isEmpty={newsSearch.items.length === 0}
          total={newsSearch.total}
          fetchNextPage={newsSearch.fetchNextPage}
        >
          {newsSearch.items.map((item, index) => (
            <NewsItemCard key={`${item.link}-${index}`} item={item} />
          ))}
        </SearchResultList>
      </TabsContent>
    </Tabs>
  );
}

export default SearchTabs;
