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
import {ApiProperty} from "@nestjs/swagger";

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
  @ApiProperty({
    type: String || null,
    default: null
  })
  searchNameTerm: string | null = null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'createdAt'
  })
  sortBy: string = 'createdAt';

  @IsOptional()
  @ToUpperCase()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'DESC'
  })
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    type: Number,
    minimum: 0,
    default: 1
  })
  pageNumber: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    type: Number,
    minimum: 0,
    default: 10
  })
  pageSize: number = 10;

  constructor(query: Partial<BlogQuery> = {}) {
    Object.assign(this, query);
  }
}
