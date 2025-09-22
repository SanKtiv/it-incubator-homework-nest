import { QueryDto } from '../../../../../../infrastructure/models/query.dto';
import {IsNumber, IsOptional, IsString, Min} from 'class-validator';
import {Type} from "class-transformer";

export class pairGameQuery extends QueryDto {
  @IsOptional()
  @IsString()
  sortBy: string = 'pairCreatedDate';
}

export class GameQueryTopUsers {
  constructor(query: Partial<QueryDto> = {}) {
    Object.assign(this, query);
  }

  @IsOptional()
  @IsString()
  sort: string | string[] = ['avgScores desc', 'sumScore desc'];

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
}