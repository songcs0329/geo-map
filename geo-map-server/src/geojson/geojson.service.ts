import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AdminLevel, GeoJSONFeatureCollection } from '../types/geojson.types';

@Injectable()
export class GeoJSONService implements OnModuleInit {
  private geoJSONData: Record<AdminLevel, GeoJSONFeatureCollection | null> = {
    sido: null,
    sgg: null,
    dong: null,
  };

  onModuleInit() {
    this.loadGeoJSONData();
  }

  private loadGeoJSONData(): void {
    const dataDir = join(__dirname, '..', 'data');
    const adminLevels: AdminLevel[] = ['sido', 'sgg', 'dong'];

    for (const level of adminLevels) {
      const filePath = join(dataDir, `${level}.json`);
      const fileContent = readFileSync(filePath, 'utf-8');
      this.geoJSONData[level] = JSON.parse(
        fileContent,
      ) as GeoJSONFeatureCollection;
      console.log(
        `Loaded ${level}.json: ${this.geoJSONData[level]?.features.length} features`,
      );
    }
  }

  getByAdminLevel(adminLevel: AdminLevel): GeoJSONFeatureCollection {
    const data = this.geoJSONData[adminLevel];
    if (!data) {
      throw new NotFoundException(`Data for ${adminLevel} not found`);
    }
    return data;
  }
}
