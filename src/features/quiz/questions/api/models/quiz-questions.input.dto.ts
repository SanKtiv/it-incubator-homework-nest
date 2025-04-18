import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { QueryDto } from '../../../../../infrastructure/models/query.dto';

export class QuizQuestionsInputDto {
  @IsString()
  @Length(6, 1000, { message: 'Login length incorrect' })
  body: string;

  @IsArray()
  correctAnswers: string[];
}

export class PublishedInputDto {
  //@Length(3, 10, { message: 'Login length incorrect' })
  @IsBoolean()
  published: boolean;
}

export class QuizQuestionsQueryInputDto extends QueryDto {
  @IsOptional()
  @IsString()
  bodySearchTerm: string;

  @IsOptional()
  @IsString()
  publishedStatus: 'all' | 'published' | 'notPublished' = 'all';
}
