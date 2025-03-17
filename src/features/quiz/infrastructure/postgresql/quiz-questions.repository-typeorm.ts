import { Injectable } from '@nestjs/common';
import { QuizQuestionsInputDto } from '../../api/models/quiz-questions.input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionsEntity } from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizQuestionsRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuizQuestionsEntity)
    protected repository: Repository<QuizQuestionsEntity>,
  ) {}

  async insert(dto: QuizQuestionsEntity): Promise<QuizQuestionsEntity> {
    return this.repository.save(dto);
  }

  async findOneById(id: string): Promise<QuizQuestionsEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async update() {}

  async softRemove(QuizQuestion: QuizQuestionsEntity): Promise<void> {
    await this.repository.softRemove(QuizQuestion);
  }

  async delete() {}
}
