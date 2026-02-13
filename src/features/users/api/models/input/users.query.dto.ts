import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToUpperCase } from '../../../../../infrastructure/decorators/transform/toUpperCase.decorator';

enum sortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class UsersQuery {
  @IsOptional()
  @IsString()
  searchLoginTerm: string | null = null;

  @IsOptional()
  @IsString()
  searchEmailTerm: string | null = null;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @ToUpperCase()
  @IsString()
  // sortDirection: 'ASC' | 'DESC' = 'DESC';
  sortDirection: sortDirection = sortDirection.DESC;

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

  constructor(query: Partial<UsersQuery> = {}) {
    Object.assign(this, query);
  }
}
