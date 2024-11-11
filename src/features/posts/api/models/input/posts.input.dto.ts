import { IsMongoId, IsString, IsUUID, Matches } from 'class-validator';
import { QueryDto } from '../../../../../infrastructure/models/query.dto';
import { InputDto } from '../../../../../infrastructure/models/input.dto';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim-custom.decorator';
import { BlogIdIsExist } from '../../../../../infrastructure/decorators/validation/blogId-is-exist.decorator';

export class PostsInputDto extends InputDto {
  @BlogIdIsExist()
  //@IsUUID(3, {message: 'BlogId incorrect'})
  @Trim()
  @IsString()
  blogId: string;
}

export class PostQuery extends QueryDto {}

export class PostLikeStatusDto {
  @Matches(/\b(None|Like|Dislike)\b/)
  @Trim()
  @IsString()
  likeStatus: 'None' | 'Like' | 'Dislike';
}
