/**
 * 행정동 GeoJSON 생성 스크립트
 *
 * GitHub 저장소 https://github.com/raqoon886/Local_HangJeongDong 에서
 * 대한민국 17개 시/도 행정동 GeoJSON 데이터를 다운로드하여
 * src/data/dong.json 파일로 병합합니다.
 *
 * 사용법: npm run generate:hangjeongdong
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const GITHUB_RAW_BASE_URL =
  'https://raw.githubusercontent.com/raqoon886/Local_HangJeongDong/master';

const SIDO_LIST = [
  '강원도',
  '경기도',
  '경상남도',
  '경상북도',
  '광주광역시',
  '대구광역시',
  '대전광역시',
  '부산광역시',
  '서울특별시',
  '세종특별자치시',
  '울산광역시',
  '인천광역시',
  '전라남도',
  '전라북도',
  '제주특별자치도',
  '충청남도',
  '충청북도',
];

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

interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: GeoJSONFeatureProperties;
  geometry: GeoJSONGeometry;
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

async function fetchGeoJSON(sidoName: string): Promise<GeoJSONFeatureCollection> {
  const encodedName = encodeURIComponent(sidoName);
  const url = `${GITHUB_RAW_BASE_URL}/hangjeongdong_${encodedName}.geojson`;

  console.log(`Fetching: ${sidoName}...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${sidoName}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<GeoJSONFeatureCollection>;
}

function generateSidoData(dongFeatures: GeoJSONFeature[]): GeoJSONFeatureCollection {
  const sidoMap = new Map<string, GeoJSONFeature[]>();

  for (const feature of dongFeatures) {
    const sidoCode = feature.properties.sido;
    if (!sidoMap.has(sidoCode)) {
      sidoMap.set(sidoCode, []);
    }
    sidoMap.get(sidoCode)!.push(feature);
  }

  const sidoFeatures: GeoJSONFeature[] = [];
  let objectId = 1;

  for (const [sidoCode, features] of sidoMap) {
    const firstFeature = features[0];

    sidoFeatures.push({
      type: 'Feature',
      properties: {
        OBJECTID: objectId++,
        adm_nm: firstFeature.properties.sidonm,
        adm_cd: sidoCode,
        adm_cd2: sidoCode,
        sgg: '',
        sido: sidoCode,
        sidonm: firstFeature.properties.sidonm,
        sggnm: '',
      },
      geometry: mergeGeometries(features.map((f) => f.geometry)),
    });
  }

  return {
    type: 'FeatureCollection',
    features: sidoFeatures,
  };
}

function generateSggData(dongFeatures: GeoJSONFeature[]): GeoJSONFeatureCollection {
  const sggMap = new Map<string, GeoJSONFeature[]>();

  for (const feature of dongFeatures) {
    const sggCode = feature.properties.sgg;
    if (!sggMap.has(sggCode)) {
      sggMap.set(sggCode, []);
    }
    sggMap.get(sggCode)!.push(feature);
  }

  const sggFeatures: GeoJSONFeature[] = [];
  let objectId = 1;

  for (const [sggCode, features] of sggMap) {
    const firstFeature = features[0];

    sggFeatures.push({
      type: 'Feature',
      properties: {
        OBJECTID: objectId++,
        adm_nm: `${firstFeature.properties.sidonm} ${firstFeature.properties.sggnm}`,
        adm_cd: sggCode,
        adm_cd2: sggCode,
        sgg: sggCode,
        sido: firstFeature.properties.sido,
        sidonm: firstFeature.properties.sidonm,
        sggnm: firstFeature.properties.sggnm,
      },
      geometry: mergeGeometries(features.map((f) => f.geometry)),
    });
  }

  return {
    type: 'FeatureCollection',
    features: sggFeatures,
  };
}

function mergeGeometries(geometries: GeoJSONGeometry[]): GeoJSONGeometry {
  const allCoordinates: number[][][][] = [];

  for (const geom of geometries) {
    if (geom.type === 'Polygon') {
      allCoordinates.push(geom.coordinates as number[][][]);
    } else if (geom.type === 'MultiPolygon') {
      allCoordinates.push(...(geom.coordinates as number[][][][]));
    }
  }

  return {
    type: 'MultiPolygon',
    coordinates: allCoordinates,
  };
}

async function main() {
  console.log('=== 행정동 GeoJSON 생성 스크립트 ===\n');

  const allFeatures: GeoJSONFeature[] = [];

  // Download all GeoJSON files
  for (const sido of SIDO_LIST) {
    try {
      const geoJSON = await fetchGeoJSON(sido);
      allFeatures.push(...geoJSON.features);
      console.log(`  -> ${geoJSON.features.length} features loaded`);
    } catch (error) {
      console.error(`  -> Error: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`\nTotal features: ${allFeatures.length}`);

  // Ensure data directory exists
  const dataDir = join(__dirname, '..', 'src', 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
    console.log(`Created directory: ${dataDir}`);
  }

  // Generate dong.json
  const dongData: GeoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: allFeatures,
  };

  const dongPath = join(dataDir, 'dong.json');
  writeFileSync(dongPath, JSON.stringify(dongData, null, 2), 'utf-8');
  console.log(`\nSaved: ${dongPath} (${allFeatures.length} features)`);

  // Generate sido.json
  const sidoData = generateSidoData(allFeatures);
  const sidoPath = join(dataDir, 'sido.json');
  writeFileSync(sidoPath, JSON.stringify(sidoData, null, 2), 'utf-8');
  console.log(`Saved: ${sidoPath} (${sidoData.features.length} features)`);

  // Generate sgg.json
  const sggData = generateSggData(allFeatures);
  const sggPath = join(dataDir, 'sgg.json');
  writeFileSync(sggPath, JSON.stringify(sggData, null, 2), 'utf-8');
  console.log(`Saved: ${sggPath} (${sggData.features.length} features)`);

  console.log('\n=== 완료 ===');
}

main().catch(console.error);
