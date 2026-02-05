import { Controller, Get, Query } from '@nestjs/common';
import { GeoJSONService } from './geojson.service';
import { GeoJSONQueryDto } from './dto/geojson-query.dto';

@Controller('api/geojson')
export class GeoJSONController {
  constructor(private readonly geoJSONService: GeoJSONService) {}

  @Get()
  getByAdminLevel(@Query() query: GeoJSONQueryDto) {
    return this.geoJSONService.getByAdminLevel(query.level);
  }
}
