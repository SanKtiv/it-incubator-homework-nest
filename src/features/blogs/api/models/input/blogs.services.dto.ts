import { BlogsInputDto } from './blogs.input.dto';

export class BlogsServicesDto extends BlogsInputDto {
  isMembership: boolean;
  createdAt: Date;
}
