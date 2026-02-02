import { IsString, IsOptional, IsIn, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQueryDto {
  @IsString()
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  display?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  start?: number = 1;

  @IsOptional()
  @IsIn(['sim', 'date'])
  sort?: 'sim' | 'date' = 'sim';
}
