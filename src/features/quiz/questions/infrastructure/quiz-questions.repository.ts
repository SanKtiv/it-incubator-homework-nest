import { Injectable } from '@nestjs/common';
import { QuizQuestionsRepositoryTypeOrm } from './postgresql/quiz-questions.repository-typeorm';
import {NewQuizQuestionsEntity, QuizQuestionsEntity} from '../domain/quiz-questions.entity';
import {
  QuizQuestionsOutputDto,
  quizQuestionsViewModel,
} from '../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsRepository {
  constructor(protected repository: QuizQuestionsRepositoryTypeOrm) {}

  async insert_OLD(dto: QuizQuestionsEntity): Promise<QuizQuestionsOutputDto> {
    const createdQuestions = await this.repository.insert_OLD(dto);

    return quizQuestionsViewModel(createdQuestions);
  }

  async insert(dto: NewQuizQuestionsEntity): Promise<QuizQuestionsOutputDto> {
    const createdQuestion = await this.repository.insert(dto);

    return quizQuestionsViewModel(createdQuestion);
  }

  async getFiveRandomQuestions(): Promise<QuizQuestionsEntity[]> {
    return this.repository.findFiveRandom();
  }

  async getQuizQuestionById_OLD(id: string): Promise<QuizQuestionsEntity | null> {
    return this.repository.findOneById_OLD(id);
  }

  async getQuizQuestionById(id: string): Promise<NewQuizQuestionsEntity | null> {
    return this.repository.findOneById(id);
  }

  async updateQuizQuestion_OLD(QuizQuestion: QuizQuestionsEntity): Promise<void> {
    await this.repository.update_OLD(QuizQuestion);
  }

  async updateQuizQuestion(QuizQuestion: NewQuizQuestionsEntity): Promise<void> {
    await this.repository.update(QuizQuestion);
  }

  async deleteQuizQuestion(QuizQuestion: QuizQuestionsEntity): Promise<void> {
    await this.repository.softRemove(QuizQuestion);
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
