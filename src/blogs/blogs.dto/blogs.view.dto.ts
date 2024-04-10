export class BlogsViewDto {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}

export class BlogsViewPagingDto {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: BlogsViewDto[],
  ) {}
}
