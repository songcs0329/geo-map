# Geo-Map Server

행정구역 기반 지도 시각화 프로젝트의 백엔드 API 서버. GeoJSON 데이터를 제공합니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Framework** | NestJS 11 |
| **Language** | TypeScript 5 |
| **Validation** | class-validator, class-transformer |
| **Config** | @nestjs/config |
| **Compression** | gzip (compression) |

## 시작하기

### 환경 변수 설정

```bash
cp .env.example .env.local
```

```bash
# .env.local
NODE_ENV=local
PORT=4000
CORS_ORIGINS=http://localhost:3000
```

### 설치 및 실행

```bash
npm install
npm run start:local
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

### Root

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/` | Hello World |

### Health Check

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/health` | 서버 상태 확인 |

### GeoJSON

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/geojson?level={level}` | 행정구역 레벨별 GeoJSON 조회 |

**Query Parameters:**
- `level`: `sido` | `sgg` | `dong`

**Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "adm_cd": "11",
        "adm_nm": "서울특별시",
        "sido": "11",
        "sidonm": "서울특별시"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[...], ...]]
      }
    }
  ]
}
```

## 프로젝트 구조

```
src/
├── main.ts                 # 애플리케이션 엔트리포인트
├── app.module.ts           # 루트 모듈
├── app.controller.ts       # 루트 컨트롤러
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
├── types/
│   └── geojson.types.ts    # 공유 타입 정의
│
└── data/                   # GeoJSON 데이터 파일
    ├── sido.json           # 시/도 (17개, ~2.7MB)
    ├── sgg.json            # 시군구 (250개, ~4.0MB)
    └── dong.json           # 동 (3,500개, ~6.8MB)
```

## CORS 설정

환경변수 `CORS_ORIGINS`에서 허용할 Origin을 설정합니다.

```bash
CORS_ORIGINS=http://localhost:3000,https://geo-map-front.vercel.app
```

허용 메서드: `GET`

## 데이터 출처

- [raqoon886/Local_HangJeongDong](https://github.com/raqoon886/Local_HangJeongDong)
