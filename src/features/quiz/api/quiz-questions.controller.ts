import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QuizQuestionsServices } from '../application/quiz-questions.services';
import { QuizQuestionsInputDto } from './models/quiz-questions.input.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';

@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
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
  async deleteQuestionsById(@Param('id') id: string): Promise<void> {
    await this.quizQuestionsServices.deleteQuestions(id);
  }
}
