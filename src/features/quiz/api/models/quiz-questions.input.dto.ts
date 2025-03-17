import { IsArray, IsString } from 'class-validator';

export class QuizQuestionsInputDto {
  //@Length(3, 10, { message: 'Login length incorrect' })
  @IsString()
  body: string;

  @IsArray()
  correctAnswers: string[];
}
