import { IsString, MaxLength, MinLength } from 'class-validator';

export class PostsInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title: string;
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  shortDescription: string;
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
  @IsString()
  blogId: string;
}
