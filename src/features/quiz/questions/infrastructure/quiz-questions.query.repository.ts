import { Injectable } from '@nestjs/common';
import { QuizQuestionsQueryRepositoryTypeOrm } from './postgresql/quiz-questions.query.repository-typeorm';
import { QuizQuestionsQueryInputDto } from '../api/models/quiz-questions.input.dto';
import { QuizQuestionsPaging } from '../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsQueryRepository {
  constructor(protected repository: QuizQuestionsQueryRepositoryTypeOrm) {}

  async getQuizQuestionsPaging_OLD(
    queryDto: QuizQuestionsQueryInputDto,
  ): Promise<QuizQuestionsPaging> {
    return this.repository.getPaging_OLD(queryDto);
  }

  async getQuizQuestionsPaging(
      queryDto: QuizQuestionsQueryInputDto,
  ): Promise<NewQuizQuestionsPaging> {
    return this.repository.getPaging(queryDto);
  }
}
