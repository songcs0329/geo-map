# Geo-Map Frontend

행정구역 기반 지도 시각화 프로젝트의 프론트엔드 애플리케이션. 네이버 지도 위에 시/도, 시군구, 동 단위의 GeoJSON 폴리곤을 렌더링하고 검색 기능을 제공합니다.

## 기술 스택

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI:** React 19, Tailwind CSS 4
- **Map:** Naver Maps API
- **State:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Form:** React Hook Form + Zod
- **UI Components:** Radix UI, Vaul (Drawer)

## 시작하기

### 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id
NEXT_PUBLIC_NAVER_MAP_CLIENT_SECRET=your_naver_map_client_secret
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 스크립트

| 명령어               | 설명               |
| -------------------- | ------------------ |
| `npm run dev`        | 개발 서버 실행     |
| `npm run build`      | 프로덕션 빌드      |
| `npm run start`      | 프로덕션 서버 실행 |
| `npm run lint`       | ESLint 검사        |
| `npm run sync-types` | 서버와 타입 동기화 |

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
- 네이버 검색 API 연동 (서버 프록시)
  - 뉴스 검색
  - 지역(장소) 검색
  - 블로그 검색
  - 카페 검색
- 키워드 검색 + 정렬 옵션 (정확도순/날짜순)
- Zod 스키마 기반 폼 검증
- 공유 버튼 (URL 복사)

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 페이지
│   └── search/[adm_cd]/    # 검색 상세 페이지 (동적 라우팅)
│
├── components/
│   ├── ui/                 # 공통 UI 컴포넌트 (Button, Input, Select, Drawer 등)
│   ├── layout/             # 레이아웃 컴포넌트 (PolygonMap, QueryProvider)
│   └── pages/              # 페이지별 컴포넌트
│       └── search/         # 검색 관련 (SearchFormHeader, SearchDrawer)
│
├── hooks/                  # Custom Hooks
│   ├── useNaverMap.tsx     # 네이버 지도 초기화
│   ├── useMapPolygon.tsx   # 폴리곤 생성/관리
│   ├── useMapBounds.tsx    # 지도 bounds/zoom 상태 추적
│   ├── useAdminGeoJSON.tsx # 행정구역 레벨별 GeoJSON 데이터
│   └── useSearchForm.tsx   # 검색 폼 상태 관리
│
├── lib/
│   ├── constants.ts        # 상수 (줌 레벨, 색상, 스타일)
│   ├── geoUtils.ts         # GeoJSON 유틸리티 함수
│   └── utils.ts            # 공통 유틸리티 (cn 등)
│
├── stores/
│   └── useMapStore.ts      # Zustand 지도 인스턴스 스토어
│
└── types/
    ├── map.ts              # GeoJSON, 폴리곤 타입 정의
    └── global.d.ts         # 전역 타입
```

## GeoJSON 데이터 출처

- [raqoon886/Local_HangJeongDong](https://github.com/raqoon886/Local_HangJeongDong)
