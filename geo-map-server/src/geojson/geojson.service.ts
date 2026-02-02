import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  AdminLevel,
  GeoJSONFeatureCollection,
  GeoJSONFeature,
} from '../types/geojson.types';

@Injectable()
export class GeoJSONService implements OnModuleInit {
  private geoJSONData: Record<AdminLevel, GeoJSONFeatureCollection | null> = {
    sido: null,
    sgg: null,
    dong: null,
  };

  private dongByAdmCd: Map<string, GeoJSONFeature> = new Map();

  onModuleInit() {
    this.loadGeoJSONData();
    this.buildDongIndex();
  }

  private loadGeoJSONData(): void {
    const dataDir = join(__dirname, '..', 'data');
    const adminLevels: AdminLevel[] = ['sido', 'sgg', 'dong'];

    for (const level of adminLevels) {
      const filePath = join(dataDir, `${level}.json`);
      const fileContent = readFileSync(filePath, 'utf-8');
      this.geoJSONData[level] = JSON.parse(fileContent);
      console.log(
        `Loaded ${level}.json: ${this.geoJSONData[level]?.features.length} features`,
      );
    }
  }

  private buildDongIndex(): void {
    const dongData = this.geoJSONData.dong;
    if (!dongData) return;

    for (const feature of dongData.features) {
      this.dongByAdmCd.set(feature.properties.adm_cd, feature);
    }
    console.log(`Built dong index: ${this.dongByAdmCd.size} entries`);
  }

  getByAdminLevel(adminLevel: AdminLevel): GeoJSONFeatureCollection {
    const data = this.geoJSONData[adminLevel];
    if (!data) {
      throw new NotFoundException(`Data for ${adminLevel} not found`);
    }
    return data;
  }

  getRegionByAdmCd(admCd: string): GeoJSONFeature {
    const feature = this.dongByAdmCd.get(admCd);

    if (!feature) {
      throw new NotFoundException(`Region with adm_cd '${admCd}' not found`);
    }

    return feature;
  }
}
