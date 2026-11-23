# Geo-Map 프로젝트 가이드

## 프로젝트 개요

행정구역 기반 지도 시각화 프로젝트. 카카오맵 위에 GeoJSON 폴리곤을 렌더링하고 장소 검색 기능을 제공합니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     geo-map-front (Next.js 16)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ KakaoMap    │  │ PolygonLayer│  │ PlaceSearch         │  │
│  │ (지도 렌더링)│  │ (폴리곤)    │  │ (장소 검색)         │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │            │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐ │
│  │              Zustand Store (지도/검색 상태)             │ │
│  └────────────────────────────┬───────────────────────────┘ │
│                               │                             │
│  ┌────────────────────────────┴───────────────────────────┐ │
│  │              TanStack Query (서버 상태 캐싱)            │ │
│  └────────────────────────────┬───────────────────────────┘ │
└───────────────────────────────┼─────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   HTTP (axios)        │
                    └───────────┬───────────┘
                                │
┌───────────────────────────────┼─────────────────────────────┐
│                     geo-map-server (NestJS 11)              │
│  ┌────────────────────────────┴───────────────────────────┐ │
│  │                  GeoJSON Module                        │ │
│  │  GET /api/geojson?level=sido|sgg|dong                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Health Module                         │ │
│  │  GET /health                                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 프로젝트 구조

### Frontend (geo-map-front)

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃 (QueryProvider, KakaoLoader)
│   └── page.tsx            # 홈페이지 (KakaoPolygonMap + PlaceSearchLayout)
│
├── components/
│   ├── ui/                 # 기본 UI (Button, Input, Select, Drawer, Item, Separator)
│   ├── layout/
│   │   ├── KakaoPolygonMap.tsx   # 카카오맵 + 폴리곤 렌더링 메인 컴포넌트
│   │   ├── PolygonLayer.tsx      # 개별 폴리곤 렌더링
│   │   └── QueryProvider.tsx     # TanStack Query 제공자
│   └── pages/
│       └── place-search/         # 장소 검색 관련 컴포넌트
│
├── hooks/
│   ├── kakao/                    # 카카오맵 관련 훅
│   │   ├── useKakaoLoader.tsx    # SDK 로드
│   │   └── useGetKakaoPlacesSearch.tsx  # 장소 검색
│   └── map/
│       └── useGetGeoJSON.tsx     # GeoJSON 데이터 fetching
│
├── stores/
│   ├── useKakaoMapStore.ts       # 지도 상태 (map, level, bounds, selectedFeature)
│   └── usePlaceSearchStore.ts    # 검색 상태
│
├── lib/
│   ├── apis/
│   │   ├── restClient.ts         # axios 인스턴스
│   │   └── geojson.ts            # GeoJSON API
│   ├── constants.ts              # 상수 (색상, 스타일, 줌 레벨)
│   └── kakaoGeoUtils.ts          # 카카오맵 유틸 함수
│
└── types/
    ├── kakao-map.types.ts        # 카카오맵 타입
    ├── kakao-places.types.ts     # 장소 검색 타입
    └── shared/
        └── geojson.types.ts      # 공유 타입 (서버와 동기화)
```

### Backend (geo-map-server)

```
src/
├── main.ts                 # 진입점 (CORS, ValidationPipe, compression)
├── app.module.ts           # 루트 모듈
├── app.controller.ts       # GET / (hello world)
│
├── geojson/
│   ├── geojson.module.ts
│   ├── geojson.controller.ts   # GET /api/geojson?level=
│   ├── geojson.service.ts      # 파일 로드 및 캐싱
│   └── dto/
│       └── geojson-query.dto.ts
│
├── health/
│   ├── health.module.ts
│   └── health.controller.ts    # GET /health
│
├── types/
│   └── geojson.types.ts        # 공유 타입
│
└── data/                       # GeoJSON 파일
    ├── sido.json               # 시/도 (17개)
    ├── sgg.json                # 시군구 (250개)
    └── dong.json               # 동 (3,500개)
```

## 핵심 상수

### 줌 레벨 설정 (constants.ts)

```typescript
// 카카오맵 레벨 (낮을수록 확대)
export const KAKAO_ZOOM_LEVELS = {
  SIDO: { min: 10, max: 12 },  // 시/도 레벨
  SGG: { min: 7, max: 9 },     // 시군구 레벨
} as const;
```

### 색상 설정

```typescript
// 시/도별 고정 색상 (17개)
export const SIDO_COLORS: Record<string, string> = {
  "11": "#FF6B6B",  // 서울
  "26": "#4ECDC4",  // 부산
  // ...
};

// 시군구 해시 기반 색상 팔레트
export const SGG_PALETTE = [
  "#FF6B6B", "#4ECDC4", ...
];
```

## 개발 규칙

### 1. 타입 동기화

Backend 타입 변경 시 반드시 Frontend로 동기화:

```bash
cd geo-map-front
npm run sync-types
```

### 2. 상태 관리 패턴

- **Zustand**: 클라이언트 상태 (지도 인스턴스, 줌 레벨, 선택된 폴리곤)
- **TanStack Query**: 서버 상태 (GeoJSON 데이터)
- **URL**: 공유 가능한 상태 (검색 파라미터)

### 3. 컴포넌트 구조

- `components/ui/`: 재사용 가능한 기본 UI
- `components/layout/`: 레이아웃 및 지도 관련
- `components/pages/`: 페이지별 컴포넌트

### 4. 훅 구조

- `hooks/kakao/`: 카카오맵 SDK 관련
- `hooks/map/`: 지도 데이터 관련

## 환경 변수

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_KAKAO_JS_KEY=your_key
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_key
```

### Backend (.env.local)

```bash
NODE_ENV=local
PORT=4000
CORS_ORIGINS=http://localhost:3000
```

## 스크립트

### Frontend

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run sync-types   # 타입 동기화
```

### Backend

```bash
npm run start:local  # 로컬 개발
npm run build        # 빌드
npm run start:prod   # 프로덕션
```

## 주의사항

1. **GeoJSON 파일 크기**: dong.json은 약 6.8MB. 프론트에서 전체 로드하지 않도록 주의
2. **카카오맵 SDK**: Script 태그로 먼저 로드해야 함 (useKakaoLoader 훅 사용)
3. **CORS**: 백엔드에서 프론트엔드 Origin 허용 필요
4. **타입 동기화**: 백엔드 타입 변경 시 반드시 `npm run sync-types` 실행

## 배포

| 서비스 | 플랫폼 | URL |
|--------|--------|-----|
| Frontend | Vercel | https://geo-map-front.vercel.app |
| Backend | Railway | https://geo-map-server.up.railway.app |
