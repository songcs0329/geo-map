import type {
  NaverSearchResponse,
  BlogItem,
  NewsItem,
  SearchParams,
} from "@/types/shared/naver-search.types";
import restClient from "./restClient";

export const searchBlog = async (params: SearchParams) => {
  const res = await restClient.get<NaverSearchResponse<BlogItem>>(
    "/search/blog",
    params
  );
  return res.data;
};

export const searchNews = async (params: SearchParams) => {
  const res = await restClient.get<NaverSearchResponse<NewsItem>>(
    "/search/news",
    params
  );
  return res.data;
};
