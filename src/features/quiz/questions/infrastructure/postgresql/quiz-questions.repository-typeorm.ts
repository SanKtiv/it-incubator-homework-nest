import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {QuestionsEntity} from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizQuestionsRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuestionsEntity) protected repository: Repository<QuestionsEntity>,
  ) {}

  async insert(dto: QuestionsEntity): Promise<QuestionsEntity> {
    return this.repository.save(dto);
  }

  async findOneById(id: string): Promise<QuestionsEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async update(dto: QuestionsEntity) {
    await this.repository.save(dto);
  }

  async getFiveRandom(): Promise<QuestionsEntity[]> {
    return this.repository
        .createQueryBuilder('q')
        .select(['q'])
        .orderBy('RANDOM()')
        .limit(5)
        .getMany();
  }

  async softRemove(QuizQuestion: QuestionsEntity): Promise<void> {
    await this.repository.softRemove(QuizQuestion);
  }

  async clear(): Promise<void> {
    await this.repository.query('TRUNCATE TABLE "new_quiz-questions" CASCADE');
  }
}
