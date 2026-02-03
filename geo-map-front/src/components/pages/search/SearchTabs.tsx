"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetSearchBlog from "@/hooks/search/useGetSearchBlog";
import useGetSearchNews from "@/hooks/search/useGetSearchNews";
import useGetSearchCafe from "@/hooks/search/useGetSearchCafe";
import SearchResultList from "./SearchResultList";
import BlogItemCard from "./BlogItemCard";
import NewsItemCard from "./NewsItemCard";
import CafeItemCard from "./CafeItemCard";
import { SearchFormSort } from "@/hooks/search/useSearchForm";

type TabValue = "blog" | "news" | "cafearticle";

interface SearchTabsProps {
  keyword: string;
  sort: SearchFormSort;
  address: string;
}

function SearchTabs({ keyword, sort, address }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("blog");
  const query = `${address} ${keyword}`;
  const blogSearch = useGetSearchBlog({ keyword: query, sort, enabled: activeTab === "blog" });
  const newsSearch = useGetSearchNews({ keyword: query, sort, enabled: activeTab === "news" });
  const cafeSearch = useGetSearchCafe({ keyword: query, sort, enabled: activeTab === "cafearticle" });

  return (
    <Tabs defaultValue="blog" className="w-full" onValueChange={(value) => setActiveTab(value as TabValue)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="blog">블로그</TabsTrigger>
        <TabsTrigger value="news">뉴스</TabsTrigger>
        <TabsTrigger value="cafearticle">카페</TabsTrigger>
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
      <TabsContent value="cafearticle" className="mt-4">
        <SearchResultList
          isLoading={cafeSearch.isLoading}
          isFetchingNextPage={cafeSearch.isFetchingNextPage}
          hasNextPage={cafeSearch.hasNextPage ?? false}
          isEmpty={cafeSearch.items.length === 0}
          total={cafeSearch.total}
          fetchNextPage={cafeSearch.fetchNextPage}
        >
          {cafeSearch.items.map((item, index) => (
            <CafeItemCard key={`${item.link}-${index}`} item={item} />
          ))}
        </SearchResultList>
      </TabsContent>
    </Tabs>
  );
}

export default SearchTabs;
