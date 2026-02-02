/**
 * 타입 동기화 스크립트
 *
 * geo-map-server의 공유 타입을 geo-map-front로 복사합니다.
 *
 * 실행: npm run sync-types
 */

import * as fs from "fs";
import * as path from "path";

const SERVER_TYPES_DIR = path.join(__dirname, "../../geo-map-server/src/types");
const FRONT_SHARED_TYPES_DIR = path.join(__dirname, "../src/types/shared");

// 복사할 타입 파일 목록
const SHARED_TYPE_FILES = ["geojson.types.ts", "naver-search.types.ts"];

function syncTypes() {
  console.log("=== 타입 동기화 시작 ===\n");

  // shared 디렉토리 생성
  if (!fs.existsSync(FRONT_SHARED_TYPES_DIR)) {
    fs.mkdirSync(FRONT_SHARED_TYPES_DIR, { recursive: true });
    console.log(`Created directory: ${FRONT_SHARED_TYPES_DIR}`);
  }

  for (const file of SHARED_TYPE_FILES) {
    const sourcePath = path.join(SERVER_TYPES_DIR, file);
    const destPath = path.join(FRONT_SHARED_TYPES_DIR, file);

    if (!fs.existsSync(sourcePath)) {
      console.error(`Source file not found: ${sourcePath}`);
      continue;
    }

    // 파일 복사
    const content = fs.readFileSync(sourcePath, "utf-8");

    // 헤더 추가
    const header = `/**
 * 이 파일은 geo-map-server에서 자동 동기화됩니다.
 * 직접 수정하지 마세요. 수정이 필요하면 서버 타입을 수정 후 sync-types를 실행하세요.
 *
 * 원본: geo-map-server/src/types/${file}
 * 동기화: npm run sync-types
 */

`;

    fs.writeFileSync(destPath, header + content, "utf-8");
    console.log(`Synced: ${file}`);
  }

  console.log("\n=== 타입 동기화 완료 ===");
}

syncTypes();
