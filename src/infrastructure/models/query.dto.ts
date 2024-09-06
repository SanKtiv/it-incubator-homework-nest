import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {ToUpperCase} from "../decorators/transform/toUpperCase.decorator";

export class QueryDto {
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @ToUpperCase()
  @IsString()
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pageNumber: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pageSize: number = 10;

  constructor(query: Partial<QueryDto> = {}) {
    Object.assign(this, query);
  }
}
