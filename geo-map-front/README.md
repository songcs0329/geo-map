# Geo-Map Frontend

행정구역 기반 지도 시각화 프로젝트의 프론트엔드 애플리케이션. 카카오맵 위에 시/도, 시군구 단위의 GeoJSON 폴리곤을 렌더링하고 장소 검색 기능을 제공합니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4 |
| **Map** | Kakao Maps SDK (react-kakao-maps-sdk) |
| **State** | Zustand 5 |
| **Data Fetching** | TanStack Query 5 |
| **Form** | React Hook Form 7 + Zod 4 |
| **UI Components** | Radix UI, Vaul (Drawer) |

## 시작하기

### 환경 변수 설정

```bash
cp .env.example .env.local
```

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_js_key
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

### 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run sync-types` | 서버와 타입 동기화 |

## 핵심 기능

### 1. 행정구역 폴리곤 렌더링

- 줌 레벨에 따라 자동으로 행정구역 단위 전환
  - `level 10-12`: 시/도 (sido)
  - `level 7-9`: 시군구 (sgg)
- 뷰포트 내 폴리곤만 렌더링 (성능 최적화)
- 호버/클릭 스타일 지원
- 시/도별 고유 색상 매핑

### 2. 지도 인터랙션

- 폴리곤 클릭 시:
  - 시/도 레벨: 시군구 레벨로 줌인
  - 시군구 레벨: 장소 검색 활성화
- URL searchParams와 지도 상태 연동

### 3. 장소 검색 기능

- Drawer 기반 검색 폼
- 카카오 Places API 연동
  - 음식점, 카페, 병원 등 카테고리 검색
  - 키워드 검색
- 검색 결과 마커 표시
- 정렬 옵션 (정확도순/거리순)

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃 (QueryProvider, KakaoLoader)
│   └── page.tsx            # 홈 페이지 (KakaoPolygonMap + PlaceSearch)
│
├── components/
│   ├── ui/                 # 공통 UI 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── KakaoPolygonMap.tsx   # 카카오맵 메인 컴포넌트
│   │   ├── PolygonLayer.tsx      # 폴리곤 렌더링
│   │   └── QueryProvider.tsx     # TanStack Query 제공자
│   └── pages/
│       └── place-search/   # 장소 검색 관련 컴포넌트
│
├── hooks/
│   ├── kakao/              # 카카오맵 관련 훅
│   │   ├── useKakaoLoader.tsx
│   │   └── useGetKakaoPlacesSearch.tsx
│   └── map/
│       └── useGetGeoJSON.tsx
│
├── stores/
│   ├── useKakaoMapStore.ts     # 지도 상태 스토어
│   └── usePlaceSearchStore.ts  # 검색 상태 스토어
│
├── lib/
│   ├── apis/               # API 클라이언트
│   ├── constants.ts        # 상수 (줌 레벨, 색상, 스타일)
│   └── kakaoGeoUtils.ts    # GeoJSON 유틸리티
│
└── types/
    ├── kakao-map.types.ts
    ├── kakao-places.types.ts
    └── shared/
        └── geojson.types.ts  # 서버와 공유 타입
```

## 타입 동기화

Backend 타입 변경 시:

```bash
npm run sync-types
```

## GeoJSON 데이터 출처

- [raqoon886/Local_HangJeongDong](https://github.com/raqoon886/Local_HangJeongDong)
