import { Injectable } from '@nestjs/common';
import { QuizQuestionsInputDto } from '../api/models/quiz-questions.input.dto';
import { QuizQuestionsRepository } from '../infrastructure/quiz-questions.repository';
import { QuizQuestionsEntity } from '../domain/quiz-questions.entity';
import { QuizQuestionsOutputDto } from '../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsServices {
  constructor(protected repository: QuizQuestionsRepository) {}

  async createQuestions(
    dto: QuizQuestionsInputDto,
  ): Promise<QuizQuestionsOutputDto> {
    const quizQuestion = new QuizQuestionsEntity();

    quizQuestion.body = dto.body;
    quizQuestion.correctAnswers = dto.correctAnswers;
    quizQuestion.createdAt = new Date();

    return this.repository.insert(quizQuestion);
  }

  async updateQuestions() {}

  async deleteQuestions() {}
}
