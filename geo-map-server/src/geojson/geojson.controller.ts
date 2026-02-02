import { Controller, Get, Query, Param } from '@nestjs/common';
import { GeoJSONService } from './geojson.service';
import { GeoJSONQueryDto } from './dto/geojson-query.dto';

@Controller('api/geojson')
export class GeoJSONController {
  constructor(private readonly geoJSONService: GeoJSONService) {}

  @Get()
  getByAdminLevel(@Query() query: GeoJSONQueryDto) {
    return this.geoJSONService.getByAdminLevel(query.level);
  }

  @Get('region/:adm_cd')
  getRegionByAdmCd(@Param('adm_cd') admCd: string) {
    return this.geoJSONService.getRegionByAdmCd(admCd);
  }
}
