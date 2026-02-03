import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import simplify from '@turf/simplify';

const DATA_DIR = join(__dirname, '..', 'src', 'data');
const FILES = ['sido', 'sgg', 'dong'] as const;

// Simplification tolerance (higher = more simplification)
const TOLERANCE: Record<(typeof FILES)[number], number> = {
  sido: 0.001, // ~100m tolerance for province level
  sgg: 0.0005, // ~50m tolerance for district level
  dong: 0.0002, // ~20m tolerance for neighborhood level
};

// Reduce coordinate precision to 6 decimal places (~10cm accuracy)
function reducePrecision(coords: number[]): number[] {
  return coords.map((c) => Math.round(c * 1000000) / 1000000);
}

function processCoordinates(coords: any): any {
  if (typeof coords[0] === 'number') {
    return reducePrecision(coords as number[]);
  }
  return coords.map(processCoordinates);
}

function optimizeGeoJSON(filename: (typeof FILES)[number]) {
  const filePath = join(DATA_DIR, `${filename}.json`);
  const backupPath = join(DATA_DIR, `${filename}.backup.json`);

  console.log(`\nProcessing ${filename}.json...`);

  // Read original file
  const originalContent = readFileSync(filePath, 'utf-8');
  const originalSize = Buffer.byteLength(originalContent, 'utf-8');
  const geojson = JSON.parse(originalContent);

  console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Features: ${geojson.features.length}`);

  // Backup original
  writeFileSync(backupPath, originalContent);
  console.log(`  Backup saved to ${filename}.backup.json`);

  // Process each feature
  let totalPointsBefore = 0;
  let totalPointsAfter = 0;

  geojson.features = geojson.features.map((feature: any) => {
    // Count points before
    const countPoints = (coords: any): number => {
      if (typeof coords[0] === 'number') return 1;
      return coords.reduce((sum: number, c: any) => sum + countPoints(c), 0);
    };
    totalPointsBefore += countPoints(feature.geometry.coordinates);

    // Apply simplification
    const simplified = simplify(feature, {
      tolerance: TOLERANCE[filename],
      highQuality: true,
    });

    // Reduce coordinate precision
    simplified.geometry.coordinates = processCoordinates(
      simplified.geometry.coordinates,
    );

    totalPointsAfter += countPoints(simplified.geometry.coordinates);

    return simplified;
  });

  // Write optimized file (minified JSON)
  const optimizedContent = JSON.stringify(geojson);
  const optimizedSize = Buffer.byteLength(optimizedContent, 'utf-8');

  writeFileSync(filePath, optimizedContent);

  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
  const pointReduction = (
    (1 - totalPointsAfter / totalPointsBefore) *
    100
  ).toFixed(1);

  console.log(`  Optimized: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Size reduction: ${reduction}%`);
  console.log(
    `  Points: ${totalPointsBefore.toLocaleString()} → ${totalPointsAfter.toLocaleString()} (${pointReduction}% reduced)`,
  );
}

console.log('=== GeoJSON Optimization Script ===');
console.log('Operations:');
console.log('  1. Polygon simplification (Douglas-Peucker algorithm)');
console.log('  2. Coordinate precision reduction (14 → 6 decimal places)');
console.log('  3. JSON minification (remove whitespace)');

for (const file of FILES) {
  optimizeGeoJSON(file);
}

console.log('\n=== Optimization Complete ===');
console.log('Original files backed up as *.backup.json');
