import { IsString, IsInt } from 'class-validator';

export class BlogsInputDto {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
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
  constructor(
    public searchNameTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageNumber: string,
    public pageSize: string,
  ) {}
}
