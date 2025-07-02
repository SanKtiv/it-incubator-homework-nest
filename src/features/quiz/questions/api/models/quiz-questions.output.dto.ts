import {NewQuizQuestionsEntity, QuizQuestionsEntity} from '../../domain/quiz-questions.entity';
import { QuizQuestionsQueryInputDto } from './quiz-questions.input.dto';

export class QuizQuestionsOutputDto {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export const quizQuestionsViewModel = (
  dto: QuizQuestionsEntity | NewQuizQuestionsEntity,
): QuizQuestionsOutputDto => ({
  id: dto.id,
  body: dto.body,
  correctAnswers: [dto.correctAnswers],
  published: dto.published,
  createdAt: dto.createdAt.toISOString(),
  updatedAt: dto.updatedAt ? dto.updatedAt.toISOString() : null,
});

export class QuizQuestionsPaging {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: QuizQuestionsOutputDto[],
  ) {}
}

export const quizQuestionsPagingViewModel = (
  dto: QuizQuestionsEntity[],
  query: QuizQuestionsQueryInputDto,
  totalCount: number,
): QuizQuestionsPaging => ({
  pagesCount: Math.ceil(totalCount / +query.pageSize),
  page: +query.pageNumber,
  pageSize: +query.pageSize,
  totalCount: totalCount,
  items: dto.map((e) => quizQuestionsViewModel(e)),
});
