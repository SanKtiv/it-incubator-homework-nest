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

  async findFiveRandom(): Promise<QuizQuestionsEntity[]> {
    return this.repository
        .createQueryBuilder('q')
        .select('q.*')
        .orderBy('RANDOM()')
        .addOrderBy('id', 'ASC')
        .limit(5)
        .getRawMany();
  }

  async findOneById(id: string): Promise<QuizQuestionsEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async update(dto: QuizQuestionsEntity) {
    await this.repository.save(dto);
  }

  async softRemove(QuizQuestion: QuizQuestionsEntity): Promise<void> {
    await this.repository.softRemove(QuizQuestion);
  }

  async clear(): Promise<void> {
    await this.repository.query('TRUNCATE TABLE "quiz-questions" CASCADE');
  }
}
