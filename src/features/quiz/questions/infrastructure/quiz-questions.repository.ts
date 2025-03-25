import { Injectable } from '@nestjs/common';
import { QuizQuestionsRepositoryTypeOrm } from './postgresql/quiz-questions.repository-typeorm';
import { QuizQuestionsEntity } from '../domain/quiz-questions.entity';
import {
  QuizQuestionsOutputDto,
  quizQuestionsViewModel,
} from '../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsRepository {
  constructor(protected repository: QuizQuestionsRepositoryTypeOrm) {}

  async insert(dto: QuizQuestionsEntity): Promise<QuizQuestionsOutputDto> {
    const createdQuestions = await this.repository.insert(dto);

    return quizQuestionsViewModel(createdQuestions);
  }

  async getQuizQuestionById(id: string): Promise<QuizQuestionsEntity | null> {
    return this.repository.findOneById(id);
  }

  async updateQuizQuestion(QuizQuestion: QuizQuestionsEntity): Promise<void> {
    await this.repository.update(QuizQuestion);
  }

  async deleteQuizQuestion(QuizQuestion: QuizQuestionsEntity): Promise<void> {
    await this.repository.softRemove(QuizQuestion);
  }

  async clear(): Promise<void> {
    await this.repository.clear()
  }
}
