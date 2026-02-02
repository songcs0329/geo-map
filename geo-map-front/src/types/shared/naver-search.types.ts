/**
 * 이 파일은 geo-map-server에서 자동 동기화됩니다.
 * 직접 수정하지 마세요. 수정이 필요하면 서버 타입을 수정 후 sync-types를 실행하세요.
 *
 * 원본: geo-map-server/src/types/naver-search.types.ts
 * 동기화: npm run sync-types
 */

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

export interface SearchParams {
  query: string;
  display?: number;
  start?: number;
  sort?: "sim" | "date";
}
