import { QueryDto } from '../../../../../../infrastructure/models/query.dto';
import {IsNumber, IsOptional, IsString, Min} from 'class-validator';
import {Type} from "class-transformer";
import {ToUpperCaseSort} from "../../../../../../infrastructure/decorators/transform/toUpperCase.decorator";

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
  @ToUpperCaseSort()
  sort: string | string[] = ['avgScores DESC', 'sumScore DESC'];

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