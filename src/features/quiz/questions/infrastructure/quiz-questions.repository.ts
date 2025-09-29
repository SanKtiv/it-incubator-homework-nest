import { Injectable } from '@nestjs/common';
import { QuizQuestionsRepositoryTypeOrm } from './postgresql/quiz-questions.repository-typeorm';
import {QuestionsEntity,
  // QuizQuestionsEntity
} from '../domain/quiz-questions.entity';
import {
  QuizQuestionsOutputDto,
  quizQuestionsViewModel,
} from '../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsRepository {
  constructor(protected repository: QuizQuestionsRepositoryTypeOrm) {}

  async insert(dto: QuestionsEntity): Promise<QuizQuestionsOutputDto> {
    const createdQuestion = await this.repository.insert(dto);

    return quizQuestionsViewModel(createdQuestion);
  }

  async getQuizQuestionById(id: string): Promise<QuestionsEntity | null> {
    return this.repository.findOneById(id);
  }

  async updateQuizQuestion(QuizQuestion: QuestionsEntity): Promise<void> {
    await this.repository.update(QuizQuestion);
  }

  async getFiveRandomQuestions(): Promise<QuestionsEntity[]> {
    return this.repository.getFiveRandom();
  }

  async deleteQuizQuestion(QuizQuestion: QuestionsEntity): Promise<void> {
    await this.repository.softRemove(QuizQuestion);
  }

  // async insert_OLD(dto: QuizQuestionsEntity): Promise<QuizQuestionsOutputDto> {
  //   const createdQuestions = await this.repository.insert_OLD(dto);
  //
  //   return quizQuestionsViewModel(createdQuestions);
  // }

  // async getFiveRandomQuestions_OLD(): Promise<QuizQuestionsEntity[]> {
  //   return this.repository.findFiveRandom_OLD();
  // }

  // async getQuizQuestionById_OLD(id: string): Promise<QuizQuestionsEntity | null> {
  //   return this.repository.findOneById_OLD(id);
  // }
  //
  // async updateQuizQuestion_OLD(QuizQuestion: QuizQuestionsEntity): Promise<void> {
  //   await this.repository.update_OLD(QuizQuestion);
  // }
  //
  // async deleteQuizQuestion_OLD(QuizQuestion: QuizQuestionsEntity): Promise<void> {
  //   await this.repository.softRemove_OLD(QuizQuestion);
  // }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
