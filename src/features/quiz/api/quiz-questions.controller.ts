import {
    Body,
    Controller,
    Delete,
    Get, HttpCode,
    Param,
    Post,
    Put, Query,
    UseGuards,
} from '@nestjs/common';
import { QuizQuestionsServices } from '../application/quiz-questions.services';
import {QuizQuestionsInputDto, QuizQuestionsQueryInputDto} from './models/quiz-questions.input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import {QuizQuestionsRepository} from "../infrastructure/quiz-questions.repository";
import {QuizQuestionsQueryRepository} from "../infrastructure/quiz-questions.query.repository";

@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
export class QuizQuestionsController {
  constructor(protected quizQuestionsServices: QuizQuestionsServices,
              protected quizQuestionsQueryRepository: QuizQuestionsQueryRepository) {}

  @Get('test')
  async test() {
    const dto: QuizQuestionsInputDto = {
      body: 'Question first',
      correctAnswers: ['Answer first'],
    };
    return this.quizQuestionsServices.createQuestions(dto);
  }

  @Post()
  async createQuestions(@Body() dto: QuizQuestionsInputDto) {
    return this.quizQuestionsServices.createQuestions(dto);
  }

  @Get()
  async getQuestions(@Query() queryDto: QuizQuestionsQueryInputDto) {
      return this.quizQuestionsQueryRepository.getQuizQuestionsPaging(queryDto)
  }

  @Put(':id')
  async updateQuestionsById() {}

  @Put(':id/publish')
  async publishQuestionsById() {}

  @Delete(':id')
  @HttpCode(204)
  async deleteQuestionsById(@Param('id') id: string): Promise<void> {
    await this.quizQuestionsServices.deleteQuestions(id);
  }
}
