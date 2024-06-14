import {IsMongoId, IsString, Matches} from 'class-validator';
import { QueryDto } from '../../../../../infrastructure/models/query.dto';
import { InputDto } from '../../../../../infrastructure/models/input.dto';
import {Trim} from "../../../../../infrastructure/decorators/transform/trim-custom.decorator";

export class PostsInputDto extends InputDto {
  @IsMongoId({message: 'incorrect id'})
  @Trim()
  @IsString()
  blogId: string;
}

export class PostQuery extends QueryDto {}

export class PostLikeStatusDto {
  @Matches('None' || 'Like' || 'Dislike')
  @Trim()
  @IsString()
  likeStatus: 'None' | 'Like' | 'Dislike';
}
