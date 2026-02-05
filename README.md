# Geo-Map

행정구역 기반 지도 시각화 프로젝트. 카카오맵 위에 시/도, 시군구 단위의 GeoJSON 폴리곤을 렌더링하고 장소 검색 기능을 제공합니다.

> **[라이브 데모](https://geo-map-front.vercel.app)** — 지도를 확대/축소하며 행정구역 단위가 변경되는 흐름을 확인해보세요.

## 핵심 기술 도전

| 과제 | 문제 | 해결 방법 |
|------|------|----------|
| **대용량 GeoJSON 렌더링** | 전국 행정구역 데이터(시/도 17개, 시군구 250개)를 동시에 렌더링하면 성능 저하 | 뷰포트 기반 렌더링으로 화면에 보이는 영역만 처리 |
| **줌 레벨 기반 상태 동기화** | 지도 줌 레벨과 UI 상태를 일관되게 유지 | Zustand로 지도 상태 중앙 관리, 줌 레벨 임계값에 따른 자동 전환 |
| **지도 인터랙션과 검색 연계** | 폴리곤 클릭 → 장소 검색까지 자연스러운 UX 흐름 | URL 기반 상태 관리로 공유 가능한 상태 유지 |

## 프로젝트 구조

```
geo-map/
├── geo-map-front/    # Next.js 프론트엔드 (포트 3000)
├── geo-map-server/   # NestJS 백엔드 API (포트 4000)
└── README.md
```

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand 5, TanStack Query 5 |
| **Backend** | NestJS 11, TypeScript, class-validator |
| **Map** | Kakao Maps SDK (react-kakao-maps-sdk) |
| **Search** | Kakao Places API |

### 기술 선택 이유

| 기술 | 선택 이유 |
|------|----------|
| **Zustand** | 지도 상태(줌 레벨, 선택된 폴리곤)를 여러 컴포넌트에서 공유. Redux보다 가볍고 Context보다 리렌더링 제어 용이 |
| **TanStack Query** | GeoJSON 데이터 캐싱, 로딩/에러 상태 관리. 서버 상태와 클라이언트 상태 분리 |
| **NestJS** | GeoJSON 데이터 제공 및 gzip 압축. 타입 안전성과 데코레이터 기반 검증 |
| **URL 기반 라우팅** | 검색 결과를 북마크하거나 공유 가능. 쿼리 파라미터로 상태 직렬화 |

## 시작하기

### 1. 환경 변수 설정

```bash
# Frontend
cp geo-map-front/.env.example geo-map-front/.env.local

# Backend
cp geo-map-server/.env.example geo-map-server/.env.local
```

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

- **행정구역 폴리곤 렌더링**: 줌 레벨에 따른 자동 전환 (시/도 ↔ 시군구)
- **뷰포트 기반 최적화**: 화면에 보이는 폴리곤만 렌더링
- **장소 검색**: 카카오 Places API로 음식점, 카페, 병원 등 검색
- **마커 표시**: 검색 결과를 지도 위에 마커로 표시

## API 엔드포인트

### Backend API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/` | Hello World |
| GET | `/health` | 서버 상태 확인 |
| GET | `/api/geojson?level={level}` | GeoJSON 데이터 조회 (sido, sgg, dong) |

## 배포 환경

| 구분 | 플랫폼 | URL |
|------|--------|-----|
| **Frontend** | Vercel | https://geo-map-front.vercel.app |
| **Backend** | Railway | https://geo-map-server.up.railway.app |

### Frontend 환경 변수 (Vercel)

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API URL |
| `NEXT_PUBLIC_APP_URL` | 프론트엔드 URL |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 JavaScript 키 |
| `NEXT_PUBLIC_KAKAO_REST_API_KEY` | 카카오 REST API 키 |

### Backend 환경 변수 (Railway)

| 변수명 | 설명 |
|--------|------|
| `NODE_ENV` | 실행 환경 (production) |
| `PORT` | 서버 포트 |
| `CORS_ORIGINS` | 허용할 Origin |

## 개발 가이드

### 타입 동기화

Backend 타입 변경 시 Frontend로 동기화:

```bash
cd geo-map-front
npm run sync-types
```

### 빌드 확인

```bash
# Frontend
cd geo-map-front && npm run build

# Backend
cd geo-map-server && npm run build
```

## 데이터 출처

- GeoJSON: [raqoon886/Local_HangJeongDong](https://github.com/raqoon886/Local_HangJeongDong)
