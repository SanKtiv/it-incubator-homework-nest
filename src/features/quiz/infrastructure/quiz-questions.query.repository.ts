import { Injectable } from '@nestjs/common';
import { QuizQuestionsQueryRepositoryTypeOrm } from './postgresql/quiz-questions.query.repository-typeorm';

@Injectable()
export class QuizQuestionsQueryRepository {
  constructor(protected repository: QuizQuestionsQueryRepositoryTypeOrm) {}
}
