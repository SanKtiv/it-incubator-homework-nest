import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PublishedInputDto,
  QuizQuestionsInputDto,
} from '../api/models/quiz-questions.input.dto';
import { QuizQuestionsRepository } from '../infrastructure/quiz-questions.repository';
import {NewQuizQuestionsEntity, QuizQuestionsEntity} from '../domain/quiz-questions.entity';
import { QuizQuestionsOutputDto } from '../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsServices {
  constructor(protected repository: QuizQuestionsRepository) {}

  async createQuestion_OLD(
    dto: QuizQuestionsInputDto,
  ): Promise<QuizQuestionsOutputDto> {
    const quizQuestion = new QuizQuestionsEntity();

    quizQuestion.body = dto.body;
    [quizQuestion.correctAnswers] = dto.correctAnswers;
    quizQuestion.createdAt = new Date();

    return this.repository.insert_OLD(quizQuestion);
  }

  async createQuestion(
      dto: QuizQuestionsInputDto,
  ): Promise<QuizQuestionsOutputDto> {
    const question = new NewQuizQuestionsEntity();

    question.body = dto.body;
    [question.correctAnswers] = dto.correctAnswers;
    question.createdAt = new Date();

    return this.repository.insert(question);
  }

  async updateQuestionsById(
    id: string,
    dto: QuizQuestionsInputDto,
  ): Promise<void> {
    const quizQuestion = await this.repository_OLD.getQuizQuestionById(id);

    if (!quizQuestion) throw new NotFoundException();

    quizQuestion.body = dto.body;
    [quizQuestion.correctAnswers] = dto.correctAnswers;
    quizQuestion.updatedAt = new Date();

    await this.repository.updateQuizQuestion(quizQuestion);
  }

  async updatePublishQuestionsById(
    id: string,
    dto: PublishedInputDto,
  ): Promise<void> {
    const quizQuestion = await this.repository.getQuizQuestionById(id);

    if (!quizQuestion) throw new NotFoundException();

    quizQuestion.published = dto.published;
    quizQuestion.updatedAt = new Date();

    await this.repository.updateQuizQuestion(quizQuestion);
  }

  async deleteQuestions(id: string): Promise<void> {
    const quizQuestion: QuizQuestionsEntity | null =
      await this.repository.getQuizQuestionById(id);

    if (!quizQuestion) throw new NotFoundException();

    await this.repository.deleteQuizQuestion(quizQuestion);
  }
}
