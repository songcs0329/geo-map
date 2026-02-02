import { Module } from '@nestjs/common';
import { GeoJSONController } from './geojson.controller';
import { GeoJSONService } from './geojson.service';

@Module({
  controllers: [GeoJSONController],
  providers: [GeoJSONService],
})
export class GeoJSONModule {}
