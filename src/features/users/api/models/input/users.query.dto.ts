import {
  IsLowercase,
  IsNumber,
  IsOptional,
  IsString,
  IsUppercase,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToUpperCase } from '../../../../../infrastructure/decorators/transform/toUpperCase.decorator';

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

  constructor(query: Partial<UsersQuery> = {}) {
    Object.assign(this, query);
  }
}
