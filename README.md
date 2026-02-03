# Geo-Map

행정구역 기반 지도 시각화 프로젝트. 네이버 지도 위에 시/도, 시군구, 동 단위의 GeoJSON 폴리곤을 렌더링하고 검색 기능을 제공합니다.

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
