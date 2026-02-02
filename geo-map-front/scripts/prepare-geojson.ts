/**
 * GeoJSON 전처리 스크립트
 *
 * 동(dong) 레벨 데이터를 읽어서 시/도, 군/구 레벨 데이터를 생성합니다.
 *
 * 실행: npx ts-node scripts/prepare-geojson.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as turf from "@turf/turf";

// Types
interface GeoJSONFeatureProperties {
  OBJECTID: number;
  adm_nm: string;
  adm_cd: string;
  adm_cd2: string;
  sgg: string;
  sido: string;
  sidonm: string;
  sggnm: string;
  [key: string]: unknown;
}

interface GeoJSONFeature {
  type: "Feature";
  properties: GeoJSONFeatureProperties;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Paths
const RAW_DIR = path.join(__dirname, "raw-geojson");
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data");

// Raw GeoJSON files
const RAW_FILES = [
  "seoul.geojson",
  "busan.geojson",
  "daegu.geojson",
  "incheon.geojson",
  "gwangju.geojson",
  "daejeon.geojson",
  "ulsan.geojson",
  "sejong.geojson",
  "gyeonggi.geojson",
  "gangwon.geojson",
  "chungbuk.geojson",
  "chungnam.geojson",
  "jeonbuk.geojson",
  "jeonnam.geojson",
  "gyeongbuk.geojson",
  "gyeongnam.geojson",
  "jeju.geojson",
];

/**
 * 모든 raw GeoJSON 파일을 읽어서 하나로 합침
 */
function loadAllFeatures(): GeoJSONFeature[] {
  const allFeatures: GeoJSONFeature[] = [];

  for (const file of RAW_FILES) {
    const filePath = path.join(RAW_DIR, file);
    console.log(`Loading ${file}...`);

    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content) as GeoJSONFeatureCollection;

    allFeatures.push(...data.features);
    console.log(`  - ${data.features.length} features loaded`);
  }

  console.log(`\nTotal features: ${allFeatures.length}`);
  return allFeatures;
}

/**
 * Feature들의 geometry를 합침 (union)
 */
function mergeGeometries(
  features: GeoJSONFeature[]
): GeoJSON.Polygon | GeoJSON.MultiPolygon | null {
  if (features.length === 0) return null;
  if (features.length === 1) {
    return features[0].geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
  }

  try {
    // Convert to turf polygons/multipolygons
    const polygons: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[] =
      features.map((f) =>
        turf.feature(f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon)
      );

    // Union all polygons
    let result = polygons[0];
    for (let i = 1; i < polygons.length; i++) {
      try {
        const unionResult = turf.union(
          turf.featureCollection([result, polygons[i]])
        );
        if (unionResult) {
          result = unionResult as GeoJSON.Feature<
            GeoJSON.Polygon | GeoJSON.MultiPolygon
          >;
        }
      } catch {
        // If union fails, skip this polygon
        console.warn(`  Warning: Union failed for polygon ${i}, skipping...`);
      }
    }

    return result.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
  } catch (error) {
    console.error("Error merging geometries:", error);
    return null;
  }
}

/**
 * 동 레벨 GeoJSON 생성 (모든 feature 그대로)
 */
function createDongLevel(
  features: GeoJSONFeature[]
): GeoJSONFeatureCollection {
  return {
    type: "FeatureCollection",
    features: features.map((f, index) => ({
      ...f,
      properties: {
        ...f.properties,
        OBJECTID: index + 1,
      },
    })),
  };
}

/**
 * 시군구 레벨 GeoJSON 생성 (sgg 코드로 그룹화 후 병합)
 */
function createSggLevel(features: GeoJSONFeature[]): GeoJSONFeatureCollection {
  // Group by sgg code
  const sggGroups = new Map<string, GeoJSONFeature[]>();

  for (const feature of features) {
    const sggCode = feature.properties.sgg;
    if (!sggGroups.has(sggCode)) {
      sggGroups.set(sggCode, []);
    }
    sggGroups.get(sggCode)!.push(feature);
  }

  console.log(`\nCreating SGG level: ${sggGroups.size} districts`);

  const sggFeatures: GeoJSONFeature[] = [];
  let index = 1;

  for (const [sggCode, group] of sggGroups) {
    const firstFeature = group[0];
    console.log(
      `  Processing ${firstFeature.properties.sidonm} ${firstFeature.properties.sggnm} (${group.length} dongs)...`
    );

    const mergedGeometry = mergeGeometries(group);
    if (!mergedGeometry) {
      console.warn(`  Warning: Could not merge geometry for ${sggCode}`);
      continue;
    }

    sggFeatures.push({
      type: "Feature",
      properties: {
        OBJECTID: index++,
        adm_nm: `${firstFeature.properties.sidonm} ${firstFeature.properties.sggnm}`,
        adm_cd: sggCode,
        adm_cd2: sggCode,
        sgg: sggCode,
        sido: firstFeature.properties.sido,
        sidonm: firstFeature.properties.sidonm,
        sggnm: firstFeature.properties.sggnm,
      },
      geometry: mergedGeometry as GeoJSONFeature["geometry"],
    });
  }

  return {
    type: "FeatureCollection",
    features: sggFeatures,
  };
}

/**
 * 시도 레벨 GeoJSON 생성 (sido 코드로 그룹화 후 병합)
 */
function createSidoLevel(features: GeoJSONFeature[]): GeoJSONFeatureCollection {
  // Group by sido code
  const sidoGroups = new Map<string, GeoJSONFeature[]>();

  for (const feature of features) {
    const sidoCode = feature.properties.sido;
    if (!sidoGroups.has(sidoCode)) {
      sidoGroups.set(sidoCode, []);
    }
    sidoGroups.get(sidoCode)!.push(feature);
  }

  console.log(`\nCreating SIDO level: ${sidoGroups.size} provinces`);

  const sidoFeatures: GeoJSONFeature[] = [];
  let index = 1;

  for (const [sidoCode, group] of sidoGroups) {
    const firstFeature = group[0];
    console.log(
      `  Processing ${firstFeature.properties.sidonm} (${group.length} dongs)...`
    );

    const mergedGeometry = mergeGeometries(group);
    if (!mergedGeometry) {
      console.warn(`  Warning: Could not merge geometry for ${sidoCode}`);
      continue;
    }

    sidoFeatures.push({
      type: "Feature",
      properties: {
        OBJECTID: index++,
        adm_nm: firstFeature.properties.sidonm,
        adm_cd: sidoCode,
        adm_cd2: sidoCode,
        sgg: sidoCode,
        sido: sidoCode,
        sidonm: firstFeature.properties.sidonm,
        sggnm: "",
      },
      geometry: mergedGeometry as GeoJSONFeature["geometry"],
    });
  }

  return {
    type: "FeatureCollection",
    features: sidoFeatures,
  };
}

/**
 * GeoJSON을 파일로 저장
 */
function saveGeoJSON(data: GeoJSONFeatureCollection, filename: string): void {
  const filePath = path.join(OUTPUT_DIR, filename);
  const content = JSON.stringify(data);
  fs.writeFileSync(filePath, content, "utf-8");

  const sizeKB = (Buffer.byteLength(content) / 1024).toFixed(1);
  console.log(`Saved ${filename} (${data.features.length} features, ${sizeKB}KB)`);
}

/**
 * 메인 실행
 */
async function main() {
  console.log("=== GeoJSON 전처리 시작 ===\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load all features
  const allFeatures = loadAllFeatures();

  // Create dong level (all features)
  console.log("\n--- Dong Level ---");
  const dongData = createDongLevel(allFeatures);
  saveGeoJSON(dongData, "dong.json");

  // Create sgg level (grouped by sgg code)
  console.log("\n--- SGG Level ---");
  const sggData = createSggLevel(allFeatures);
  saveGeoJSON(sggData, "sgg.json");

  // Create sido level (grouped by sido code)
  console.log("\n--- Sido Level ---");
  const sidoData = createSidoLevel(allFeatures);
  saveGeoJSON(sidoData, "sido.json");

  console.log("\n=== 전처리 완료 ===");
}

main().catch(console.error);
