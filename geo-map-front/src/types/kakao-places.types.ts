// 카테고리 그룹 코드
export type CategoryGroupCode =
  | "MT1"   // 대형마트
  | "CS2"   // 편의점
  | "PS3"   // 어린이집, 유치원
  | "SC4"   // 학교
  | "AC5"   // 학원
  | "PK6"   // 주차장
  | "OL7"   // 주유소, 충전소
  | "SW8"   // 지하철역
  | "BK9"   // 은행
  | "CT1"   // 문화시설
  | "AG2"   // 중개업소
  | "PO3"   // 공공기관
  | "AT4"   // 관광명소
  | "AD5"   // 숙박
  | "FD6"   // 음식점
  | "CE7"   // 카페
  | "HP8"   // 병원
  | "PM9"; // 약국

// 정렬 타입
export type PlaceSearchSort = "distance" | "accuracy";

// 카테고리 검색 폼 데이터
export interface CategorySearchFormData {
  category_group_code: CategoryGroupCode;
  x: string;  // 경도
  y: string;  // 위도
  radius: number;
  sort?: PlaceSearchSort;
  page?: number;
  size?: number;
}

// 키워드 검색 폼 데이터
export interface KeywordSearchFormData {
  query: string;
  x: string;
  y: string;
  radius: number;
  category_group_code?: CategoryGroupCode;
  sort?: PlaceSearchSort;
  page?: number;
  size?: number;
}

// Places API 응답
export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;  // 경도
  y: string;  // 위도
  place_url: string;
  distance?: string;
}
