import {IsString, IsOptional, IsNumber, Min, MinLength, MaxLength, Matches, Length} from 'class-validator';
import { Type } from 'class-transformer';

export class BlogsInputDto {
  @Length(1, 15)
  @IsString()
  name: string

  @Length(1, 300)
  @IsString()
  description: string

  @Matches(
      new RegExp('\^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'),
      {
        message: 'This email can not exist',
      })
  @Length(1, 100)
  @IsString()
  websiteUrl: string
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
  @IsString()
  sortDirection: 'asc' | 'desc' = 'desc';

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
