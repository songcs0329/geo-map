# Geo-Map Server

행정구역 기반 지도 시각화 프로젝트의 백엔드 API 서버. GeoJSON 데이터 제공 및 네이버 검색 API 프록시 기능을 담당합니다.

## 기술 스택

- **Framework:** NestJS 11
- **Language:** TypeScript 5
- **Validation:** class-validator, class-transformer
- **Config:** @nestjs/config

## 시작하기

### 환경 변수 설정

```bash
# .env.local
NAVER_API_BASE_URL=https://openapi.naver.com/v1
NAVER_SEARCH_CLIENT_ID=your_client_id
NAVER_SEARCH_CLIENT_SECRET=your_client_secret
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (local 환경)
npm run start:local

# 개발 서버 실행 (development 환경)
npm run start:dev
```

서버는 [http://localhost:4000](http://localhost:4000)에서 실행됩니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run start:local` | 로컬 개발 서버 (watch mode) |
| `npm run start:dev` | 개발 서버 (watch mode) |
| `npm run start:prod` | 프로덕션 서버 |
| `npm run build` | 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | 단위 테스트 |
| `npm run test:e2e` | E2E 테스트 |

## API 엔드포인트

### Health Check

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/health` | 서버 상태 확인 |

### GeoJSON

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/geojson?level={level}` | 행정구역 레벨별 GeoJSON 조회 |
| GET | `/api/geojson/region/:adm_cd` | 특정 행정구역 GeoJSON 조회 |

**Query Parameters:**
- `level`: `sido` \| `sgg` \| `dong`

### Search (Naver API Proxy)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/search/blog` | 네이버 블로그 검색 |
| GET | `/api/search/news` | 네이버 뉴스 검색 |

**Query Parameters:**
- `query` (required): 검색어
- `display` (optional): 결과 개수 (1-100, 기본값: 10)
- `start` (optional): 시작 위치 (1-1000, 기본값: 1)
- `sort` (optional): 정렬 기준 (`sim` \| `date`, 기본값: `sim`)

## 프로젝트 구조

```
src/
├── app.module.ts           # 루트 모듈
├── main.ts                 # 애플리케이션 엔트리포인트
│
├── health/                 # Health Check 모듈
│   ├── health.module.ts
│   └── health.controller.ts
│
├── geojson/                # GeoJSON 모듈
│   ├── geojson.module.ts
│   ├── geojson.controller.ts
│   ├── geojson.service.ts
│   └── dto/
│       └── geojson-query.dto.ts
│
├── search/                 # 검색 모듈 (Naver API Proxy)
│   ├── search.module.ts
│   ├── search.controller.ts
│   ├── search.service.ts
│   └── dto/
│       └── search-query.dto.ts
│
├── types/                  # 타입 정의
│   ├── geojson.types.ts
│   └── naver-search.types.ts
│
└── data/                   # GeoJSON 데이터 파일
    ├── sido.json
    ├── sgg.json
    └── dong.json
```

## CORS 설정

현재 다음 Origin을 허용합니다:
- `http://localhost:3000`
- `http://localhost:3001`

허용 메서드: `GET`
