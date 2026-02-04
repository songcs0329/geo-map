import { IsString, IsOptional, IsIn, MinLength } from 'class-validator';

export class GeoJSONSearchDto {
  @IsString()
  @MinLength(1)
  regionName: string;

  @IsOptional()
  @IsIn(['sido', 'sgg', 'dong'])
  level?: 'sido' | 'sgg' | 'dong';
}
