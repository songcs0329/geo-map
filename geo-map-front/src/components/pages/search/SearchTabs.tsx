"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetSearchBlog from "@/hooks/search/useGetSearchBlog";
import useGetSearchNews from "@/hooks/search/useGetSearchNews";
import useGetSearchCafe from "@/hooks/search/useGetSearchCafe";
import { SearchFormSort } from "@/hooks/search/useSearchForm";
import useGetSearchLocal from "@/hooks/search/useGetSearchLocal";
import SearchResultList from "./SearchResultList";
import BlogItemCard from "./BlogItemCard";
import NewsItemCard from "./NewsItemCard";
import CafeItemCard from "./CafeItemCard";
import LocalItemCard from "./LocalItemCard";

const TAB_CONFIG = [
  { value: "local", label: "지역" },
  { value: "blog", label: "블로그" },
  { value: "news", label: "뉴스" },
  { value: "cafearticle", label: "카페" },
] as const;

type TabValue = (typeof TAB_CONFIG)[number]["value"];

type SearchTabsProps = {
  keyword: string;
  sort: SearchFormSort;
  address: string;
};

function SearchTabs({ keyword, sort, address }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("local");
  const query = `${address} ${keyword}`;

  const localSearch = useGetSearchLocal({
    keyword: query,
    sort,
    enabled: activeTab === "local",
  });
  const blogSearch = useGetSearchBlog({
    keyword: query,
    sort,
    enabled: activeTab === "blog",
  });
  const newsSearch = useGetSearchNews({
    keyword: query,
    sort,
    enabled: activeTab === "news",
  });
  const cafeSearch = useGetSearchCafe({
    keyword: query,
    sort,
    enabled: activeTab === "cafearticle",
  });

  const renderContent = (tabValue: TabValue) => {
    const configMap = {
      local: {
        search: localSearch,
        renderItems: () =>
          localSearch.items.map((item, index) => (
            <LocalItemCard key={`${item.link}-${index}`} item={item} />
          )),
      },
      blog: {
        search: blogSearch,
        renderItems: () =>
          blogSearch.items.map((item, index) => (
            <BlogItemCard key={`${item.link}-${index}`} item={item} />
          )),
      },
      news: {
        search: newsSearch,
        renderItems: () =>
          newsSearch.items.map((item, index) => (
            <NewsItemCard key={`${item.link}-${index}`} item={item} />
          )),
      },
      cafearticle: {
        search: cafeSearch,
        renderItems: () =>
          cafeSearch.items.map((item, index) => (
            <CafeItemCard key={`${item.link}-${index}`} item={item} />
          )),
      },
    };

    const { search, renderItems } = configMap[tabValue];

    return (
      <SearchResultList
        isLoading={search.isLoading}
        isFetchingNextPage={search.isFetchingNextPage}
        hasNextPage={search.hasNextPage ?? false}
        isEmpty={search.items.length === 0}
        total={search.total}
        fetchNextPage={search.fetchNextPage}
      >
        {renderItems()}
      </SearchResultList>
    );
  };

  return (
    <Tabs
      defaultValue="local"
      className="w-full"
      onValueChange={(value) => setActiveTab(value as TabValue)}
    >
      <TabsList className="grid w-full grid-cols-4">
        {TAB_CONFIG.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TAB_CONFIG.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {renderContent(tab.value)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default SearchTabs;
