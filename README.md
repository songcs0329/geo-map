# Geo-Map

행정구역 기반 지도 시각화 프로젝트. 네이버 지도 위에 시/도, 시군구, 동 단위의 GeoJSON 폴리곤을 렌더링하고 검색 기능을 제공합니다.

## 프로젝트 구조

```
geo-map/
├── geo-map-front/    # Next.js 프론트엔드
└── geo-map-server/   # NestJS 백엔드 API
```

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, TanStack Query |
| **Backend** | NestJS 11, TypeScript, class-validator |
| **Map** | Naver Maps API |
| **External API** | Naver Search API (Blog, News) |

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

## 데이터 출처

- GeoJSON: [raqoon886/Local_HangJeongDong](https://github.com/raqoon886/Local_HangJeongDong)
