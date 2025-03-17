import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QuizQuestionsServices } from '../application/quiz-questions.services';
import { QuizQuestionsInputDto } from './models/quiz-questions.input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
  constructor(protected quizQuestionsServices: QuizQuestionsServices) {}

  @Get('test')
  async test() {
    const dto: QuizQuestionsInputDto = {
      body: 'Question first',
      correctAnswers: ['Answer first'],
    };
    return this.quizQuestionsServices.createQuestions(dto);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createQuestions(@Body() dto: QuizQuestionsInputDto) {
    return this.quizQuestionsServices.createQuestions(dto);
  }

  @Get()
  async getQuestions() {}

  @Put(':id')
  async updateQuestionsById() {}

  @Put(':id/publish')
  async publishQuestionsById() {}

  @Delete(':id')
  async deleteQuestionsById() {}
}
