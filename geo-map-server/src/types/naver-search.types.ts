export interface NaverSearchResponse<T> {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: T[];
}

export interface BlogItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string; // YYYYMMDD 형식
}

export interface NewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string; // RFC 822 형식
}

export interface CafeItem {
  title: string;
  link: string;
  description: string;
  cafename: string;
  cafeurl: string;
}

export interface SearchParams {
  query: string;
  display?: number;
  start?: number;
  sort?: 'sim' | 'date';
}
