# Geo-Map

행정구역 기반 지도 시각화 프로젝트. 네이버 지도 위에 시/도, 시군구, 동 단위의 GeoJSON 폴리곤을 렌더링하고 검색 기능을 제공합니다.

> **[🗺️ 라이브 데모](https://geo-map-front.vercel.app)** — 지도를 확대/축소하며 행정구역 단위가 변경되는 흐름을 확인해보세요.

## 🎯 핵심 기술 도전

이 프로젝트에서 해결한 주요 기술적 과제입니다:

| 과제 | 문제 | 해결 방법 |
|------|------|----------|
| **대용량 GeoJSON 렌더링** | 전국 행정구역 데이터(시/도 17개, 시군구 250개, 읍면동 3,500+개)를 동시에 렌더링하면 성능 저하 | 뷰포트 기반 렌더링으로 화면에 보이는 영역만 처리 |
| **줌 레벨 기반 상태 동기화** | 지도 줌 레벨과 UI 상태(어떤 행정구역 레벨을 보여줄지)를 일관되게 유지 | Zustand로 지도 상태 중앙 관리, 줌 레벨 임계값에 따른 자동 전환 |
| **지도 인터랙션과 외부 API 연계** | 폴리곤 클릭 → 검색 결과 표시까지 자연스러운 UX 흐름 구현 | TanStack Query로 서버 상태 분리, URL 기반 라우팅으로 공유 가능한 상태 유지 |

## 📖 사용 가이드

1. **줌 인/아웃**: 지도를 확대하면 시/도 → 시군구 → 읍면동 순으로 행정구역 단위가 자동 전환됩니다
2. **행정구역 클릭**: 읍면동 단위에서 폴리곤을 클릭하면 해당 지역의 뉴스, 블로그, 카페 검색 결과를 확인할 수 있습니다
3. **검색 필터**: 키워드와 정렬 기준을 변경하여 원하는 정보를 탐색할 수 있습니다
4. **공유**: 검색 결과 페이지의 URL을 공유하면 동일한 지역과 검색 조건을 그대로 전달할 수 있습니다

## 프로젝트 구조

```
geo-map/
├── geo-map-front/    # Next.js 프론트엔드
└── geo-map-server/   # NestJS 백엔드 API
```

## 기술 스택

| 구분             | 기술                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| **Frontend**     | Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, TanStack Query |
| **Backend**      | NestJS 11, TypeScript, class-validator                                  |
| **Map**          | Naver Maps API                                                          |
| **External API** | Naver Search API (Blog, News)                                           |

### 기술 선택 이유

| 기술 | 선택 이유 |
|------|----------|
| **Zustand** | 지도 상태(줌 레벨, 선택된 폴리곤)는 여러 컴포넌트에서 동시에 접근해야 함. Redux보다 보일러플레이트가 적고, Context API보다 리렌더링 제어가 용이 |
| **TanStack Query** | 검색 API 응답의 캐싱, 로딩/에러 상태 관리, 백그라운드 리페치가 필요. 서버 상태와 클라이언트 상태를 명확히 분리 |
| **NestJS** | 프론트엔드에서 외부 API 키 노출 없이 검색 API를 호출하기 위한 프록시 레이어. 타입 안전성과 데코레이터 기반 검증 제공 |
| **URL 기반 라우팅** | 검색 결과 페이지를 북마크하거나 공유할 수 있어야 함. `/search/[adm_cd]?keyword=...` 형태로 상태를 URL에 직렬화 |

## 시작하기

### 1. 환경 변수 설정

```bash
# Frontend
cp geo-map-front/.env.example geo-map-front/.env.local

# Backend
cp geo-map-server/.env.example geo-map-server/.env.local
```

각 `.env.local` 파일을 열어 실제 API 키를 입력하세요.

### 2. 설치 및 실행

```bash
# Backend
cd geo-map-server
npm install
npm run start:local    # http://localhost:4000

# Frontend (새 터미널)
cd geo-map-front
npm install
npm run dev            # http://localhost:3000
```

## 주요 기능

- 줌 레벨에 따른 행정구역 자동 전환 (시/도 → 시군구 → 동)
- 뷰포트 기반 폴리곤 렌더링 (성능 최적화)
- 행정구역 클릭 시 네이버 블로그/뉴스 검색

## 배포 환경

| 구분         | 플랫폼  | URL                                   |
| ------------ | ------- | ------------------------------------- |
| **Frontend** | Vercel  | https://geo-map-front.vercel.app      |
| **Backend**  | Railway | https://geo-map-server.up.railway.app |

### Frontend (Vercel)

**환경 변수:**

| 변수명                                | 설명                      |
| ------------------------------------- | ------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`            | 백엔드 API URL            |
| `NEXT_PUBLIC_APP_URL`                 | 프론트엔드 URL            |
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`     | 네이버 지도 Client ID     |
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_SECRET` | 네이버 지도 Client Secret |

**배포 방법:**

1. Vercel에서 GitHub 레포지토리 연결
2. Root Directory를 `geo-map-front`로 설정
3. 환경 변수 설정 후 배포

### Backend (Railway)

**환경 변수:**

| 변수명                       | 설명                          |
| ---------------------------- | ----------------------------- |
| `NODE_ENV`                   | 실행 환경 (production)        |
| `PORT`                       | 서버 포트                     |
| `CORS_ORIGINS`               | 허용할 Origin (쉼표 구분)     |
| `NAVER_API_BASE_URL`         | 네이버 API 기본 URL           |
| `NAVER_SEARCH_CLIENT_ID`     | 네이버 검색 API Client ID     |
| `NAVER_SEARCH_CLIENT_SECRET` | 네이버 검색 API Client Secret |

**배포 방법:**

1. Railway에서 GitHub 레포지토리 연결
2. Root Directory를 `geo-map-server`로 설정
3. 환경 변수 설정
4. Start Command: `npm run start:prod`

## 데이터 출처

- GeoJSON: [raqoon886/Local_HangJeongDong](https://github.com/raqoon886/Local_HangJeongDong)
