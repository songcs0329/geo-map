import type {
  NaverSearchResponse,
  BlogItem,
  NewsItem,
  CafeItem,
  SearchParams,
  LocalItem,
} from "@/types/shared/naver-search.types";
import restClient from "./restClient";

export const getSearchBlog = async (params: SearchParams) => {
  const res = await restClient.get<NaverSearchResponse<BlogItem>>(
    "/search/blog",
    params
  );
  return res.data;
};

export const getSearchNews = async (params: SearchParams) => {
  const res = await restClient.get<NaverSearchResponse<NewsItem>>(
    "/search/news",
    params
  );
  return res.data;
};

export const getSearchCafe = async (params: SearchParams) => {
  const res = await restClient.get<NaverSearchResponse<CafeItem>>(
    "/search/cafearticle",
    params
  );
  return res.data;
}

export const getSearchLocal = async (params: SearchParams) => {
  const res = await restClient.get<NaverSearchResponse<LocalItem>>(
    "/search/local",
    params
  );
  return res.data;
}