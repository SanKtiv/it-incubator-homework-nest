import { IsString } from 'class-validator';
import { QueryDto } from '../../../../../infrastructure/models/query.dto';
import { InputDto } from '../../../../../infrastructure/models/input.dto';

export class PostsInputDto extends InputDto {
  @IsString()
  blogId: string;
}

export class PostQuery extends QueryDto {}

export class PostLikeStatus {
  @IsString()
  likeStatus: string = 'None' || 'Like' || 'Dislike';
}
