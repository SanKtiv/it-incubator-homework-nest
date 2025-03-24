import {IsArray, IsBoolean, IsOptional, IsString} from 'class-validator';
import {QueryDto} from "../../../../infrastructure/models/query.dto";

export class QuizQuestionsInputDto {
  //@Length(3, 10, { message: 'Login length incorrect' })
  @IsString()
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
