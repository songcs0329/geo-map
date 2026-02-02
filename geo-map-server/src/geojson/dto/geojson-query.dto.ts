import { IsIn } from 'class-validator';

export class GeoJSONQueryDto {
  @IsIn(['sido', 'sgg', 'dong'])
  level: 'sido' | 'sgg' | 'dong';
}
