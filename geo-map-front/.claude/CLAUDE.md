# Geo-Map Project

행정구역 기반 지도 시각화 프로젝트. 네이버 지도 위에 시/도, 시군구, 동 단위의 GeoJSON 폴리곤을 렌더링하고 검색 기능을 제공합니다.

## 기술 스택

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI:** React 19, Tailwind CSS 4
- **Map:** Naver Maps API
- **State:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Form:** React Hook Form + Zod
- **UI Components:** Radix UI, Vaul (Drawer)

## 프로젝트 구조

```
geo-map-front/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 페이지
│   │   └── search/[adm_cd]/    # 검색 상세 페이지 (동적 라우팅)
│   │
│   ├── components/
│   │   ├── ui/                 # 공통 UI 컴포넌트 (Button, Input, Select, Drawer 등)
│   │   ├── layout/             # 레이아웃 컴포넌트 (PolygonMap, QueryProvider)
│   │   └── pages/              # 페이지별 컴포넌트
│   │       └── search/         # 검색 관련 (SearchFormHeader, SearchDrawer)
│   │
│   ├── hooks/                  # Custom Hooks
│   │   ├── useNaverMap.tsx     # 네이버 지도 초기화
│   │   ├── useMapPolygon.tsx   # 폴리곤 생성/관리
│   │   ├── useMapBounds.tsx    # 지도 bounds/zoom 상태 추적
│   │   ├── useAdminGeoJSON.tsx # 행정구역 레벨별 GeoJSON 데이터
│   │   └── useSearchForm.tsx   # 검색 폼 상태 관리
│   │
│   ├── lib/
│   │   ├── constants.ts        # 상수 (줌 레벨, 색상, 스타일)
│   │   ├── geoUtils.ts         # GeoJSON 유틸리티 함수
│   │   └── utils.ts            # 공통 유틸리티 (cn 등)
│   │
│   ├── stores/
│   │   └── useMapStore.ts      # Zustand 지도 인스턴스 스토어
│   │
│   ├── types/
│   │   ├── map.ts              # GeoJSON, 폴리곤 타입 정의
│   │   └── global.d.ts         # 전역 타입
│   │
│   └── data/                   # GeoJSON 데이터 파일
│       ├── sido.json           # 시/도 (~17개)
│       ├── sgg.json            # 시군구 (~250개)
│       └── dong.json           # 동 (~3,500개)
│
├── scripts/
│   └── prepare-geojson.ts      # GeoJSON 전처리 스크립트
│
└── public/                     # 정적 파일
```

## 핵심 기능

### 1. 행정구역 폴리곤 렌더링

- 줌 레벨에 따라 자동으로 행정구역 단위 전환
  - `zoom 0-9`: 시/도 (sido)
  - `zoom 10-12`: 시군구 (sgg)
  - `zoom 13+`: 동 (dong)
- 뷰포트 내 폴리곤만 렌더링 (성능 최적화)
- 호버/클릭 스타일 지원
- 시/도별 고유 색상 매핑

### 2. 지도 인터랙션

- 폴리곤 클릭 시:
  - 시/도, 시군구 레벨: 다음 레벨로 줌인
  - 동 레벨: 검색 페이지(`/search/[adm_cd]`)로 이동
- URL searchParams와 지도 상태 연동 (lat, lng, zoom)

### 3. 검색 기능

- Drawer 기반 검색 폼
- 키워드 검색 + 정렬 옵션 (정확도순/날짜순)
- Zod 스키마 기반 폼 검증
- URL searchParams 연동

## 개발 가이드

### 환경 변수

```bash
# .env.local
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id
```

### 스크립트

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# GeoJSON 전처리
npm run prepare-geojson
```

### 코드 컨벤션

- **컴포넌트:** PascalCase, 함수형 컴포넌트
- **Hook:** `use` 접두사, camelCase
- **타입:** `src/types/`에 정의, 인터페이스 사용
- **상수:** `src/lib/constants.ts`에 집중
- **스타일:** Tailwind CSS 클래스 사용

### 지도 관련 주의사항

1. **Naver Maps API**
   - `window.naver.maps` 로드 후 사용
   - SSR 환경에서 `"use client"` 필수

2. **폴리곤 메모리 관리**
   - 뷰포트 변경 시 기존 폴리곤 cleanup 필수
   - 이벤트 리스너 해제 필수

3. **GeoJSON 좌표계**
   - 형식: `[lng, lat]` (경도, 위도 순서)
   - Naver Maps는 `(lat, lng)` 사용하므로 변환 필요

## 타입 참조

### AdminLevel

```typescript
type AdminLevel = "sido" | "sgg" | "dong";
```

### GeoJSONFeature

```typescript
interface GeoJSONFeature {
  type: "Feature";
  properties: {
    adm_nm: string;   // 행정구역명 (서울특별시 종로구 사직동)
    adm_cd: string;   // 행정코드
    sido: string;     // 시도 코드 (11 = 서울)
    sidonm: string;   // 시도명
    sgg: string;      // 시군구 코드
    sggnm: string;    // 시군구명
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}
```

## GeoJSON 데이터 출처

- [raqoon886/Local_HangJeongDong](https://github.com/raqoon886/Local_HangJeongDong)
