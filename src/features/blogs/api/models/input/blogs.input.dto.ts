import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Matches,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim-custom.decorator';
import { ToUpperCase } from '../../../../../infrastructure/decorators/transform/toUpperCase.decorator';

export class BlogsInputDto {
  @Length(1, 15)
  @Trim()
  @IsString()
  name: string;

  @Length(1, 300)
  @Trim()
  @IsString()
  description: string;

  @Matches(
    new RegExp(
      '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
    ),
    {
      message: 'This website can not exist',
    },
  )
  @Length(1, 100)
  @Trim()
  @IsString()
  websiteUrl: string;
}

export class CreatingBlogDto {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}

export class BlogQuery {
  @IsOptional()
  @IsString()
  searchNameTerm: string | null = null;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @ToUpperCase()
  @IsString()
  sortDirection: 'ASC' | 'DESC' = 'DESC';
  //sortDirection: 'asc' | 'desc' = 'desc';

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

  constructor(query: Partial<BlogQuery> = {}) {
    Object.assign(this, query);
  }
}
