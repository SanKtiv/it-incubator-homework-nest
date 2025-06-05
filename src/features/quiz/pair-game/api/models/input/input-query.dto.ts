import { QueryDto } from '../../../../../../infrastructure/models/query.dto';
import { IsOptional, IsString } from 'class-validator';

export class pairGameQuery extends QueryDto {
  @IsOptional()
  @IsString()
  sortBy: string = 'pairCreatedDate';
}
