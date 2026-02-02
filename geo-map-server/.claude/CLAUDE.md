# Geo-Map Server Project

행정구역 기반 지도 시각화 프로젝트의 백엔드 API 서버. GeoJSON 데이터 제공 및 네이버 검색 API 프록시 기능을 담당합니다.

## 기술 스택

- **Framework:** NestJS 11
- **Language:** TypeScript 5
- **Validation:** class-validator, class-transformer
- **Config:** @nestjs/config
- **Testing:** Jest

## 프로젝트 구조

```
geo-map-server/
├── src/
│   ├── app.module.ts           # 루트 모듈 (ConfigModule, 각 모듈 import)
│   ├── main.ts                 # 엔트리포인트 (CORS, ValidationPipe 설정)
│   │
│   ├── health/                 # Health Check 모듈
│   │   ├── health.module.ts
│   │   └── health.controller.ts
│   │
│   ├── geojson/                # GeoJSON 모듈
│   │   ├── geojson.module.ts
│   │   ├── geojson.controller.ts   # /api/geojson 라우트
│   │   ├── geojson.service.ts      # GeoJSON 파일 로드 및 필터링
│   │   └── dto/
│   │       └── geojson-query.dto.ts
│   │
│   ├── search/                 # 검색 모듈 (Naver API Proxy)
│   │   ├── search.module.ts
│   │   ├── search.controller.ts    # /api/search 라우트
│   │   ├── search.service.ts       # Naver API 호출
│   │   └── dto/
│   │       └── search-query.dto.ts
│   │
│   ├── types/                  # 공유 타입 정의
│   │   ├── geojson.types.ts        # GeoJSON 관련 타입
│   │   └── naver-search.types.ts   # Naver Search API 응답 타입
│   │
│   └── data/                   # GeoJSON 정적 데이터
│       ├── sido.json           # 시/도 (~17개)
│       ├── sgg.json            # 시군구 (~250개)
│       └── dong.json           # 동 (~3,500개)
│
├── test/                       # E2E 테스트
└── dist/                       # 빌드 출력
```

## API 설계

### 1. GeoJSON API

```
GET /api/geojson?level={level}
```

- `level`: `sido` | `sgg` | `dong`
- 응답: 해당 레벨의 전체 GeoJSON FeatureCollection

```
GET /api/geojson/region/:adm_cd
```

- `adm_cd`: 행정구역 코드
- 응답: 특정 행정구역의 GeoJSON Feature

### 2. Search API (Naver Proxy)

```
GET /api/search/blog?query={query}&display={display}&start={start}&sort={sort}
GET /api/search/news?query={query}&display={display}&start={start}&sort={sort}
```

**Parameters:**
- `query` (required): 검색어
- `display`: 결과 개수 (1-100, default: 10)
- `start`: 시작 위치 (1-1000, default: 1)
- `sort`: `sim` (정확도) | `date` (날짜순)

## 환경 변수

```bash
# .env.local 또는 .env.development
PORT=4000

# Naver Search API
NAVER_API_BASE_URL=https://openapi.naver.com/v1
NAVER_SEARCH_CLIENT_ID=your_client_id
NAVER_SEARCH_CLIENT_SECRET=your_client_secret
```

환경별 파일: `.env.{NODE_ENV}` (local, development, production)

## 개발 가이드

### 스크립트

```bash
# 로컬 개발 (watch mode)
npm run start:local

# 빌드
npm run build

# 프로덕션 실행
npm run start:prod

# 테스트
npm run test
npm run test:e2e
```

### 코드 컨벤션

- **모듈 구조:** NestJS 표준 모듈 구조 (Controller, Service, Module, DTO)
- **DTO 검증:** class-validator 데코레이터 사용
- **타입:** `src/types/`에 공유 타입 정의
- **환경 변수:** ConfigService를 통해 접근

### NestJS 모듈 패턴

```typescript
// 새 모듈 추가 시
1. src/{module}/ 디렉토리 생성
2. {module}.module.ts, {module}.controller.ts, {module}.service.ts 생성
3. DTO가 필요하면 dto/ 서브디렉토리에 생성
4. app.module.ts에 import
```

### ValidationPipe 설정

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,      // DTO 자동 변환
    whitelist: true,      // 정의되지 않은 속성 제거
  }),
);
```

### CORS 설정

```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET'],
});
```

## 타입 참조

### AdminLevel

```typescript
type AdminLevel = 'sido' | 'sgg' | 'dong';
```

### SearchParams

```typescript
interface SearchParams {
  query: string;
  display?: number;   // 1-100
  start?: number;     // 1-1000
  sort?: 'sim' | 'date';
}
```

### NaverSearchResponse

```typescript
interface NaverSearchResponse<T> {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: T[];
}
```

### BlogItem / NewsItem

```typescript
interface BlogItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;     // YYYYMMDD
}

interface NewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;      // RFC 822
}
```

## 주의사항

1. **Naver API 키 보안:** .env 파일은 절대 커밋하지 않음
2. **GeoJSON 파일 크기:** dong.json이 가장 크므로 메모리 사용량 주의
3. **CORS:** 프로덕션 환경에서는 실제 도메인으로 변경 필요
