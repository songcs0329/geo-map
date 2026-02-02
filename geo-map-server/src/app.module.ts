import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { GeoJSONModule } from './geojson/geojson.module';

@Module({
  imports: [HealthModule, GeoJSONModule],
})
export class AppModule {}
