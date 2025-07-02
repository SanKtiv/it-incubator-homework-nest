import { Injectable } from '@nestjs/common';
import { QuizQuestionsInputDto } from '../../api/models/quiz-questions.input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {NewQuizQuestionsEntity, QuizQuestionsEntity} from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizQuestionsRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuizQuestionsEntity)
    protected repository_OLD: Repository<QuizQuestionsEntity>,
    protected repository: Repository<NewQuizQuestionsEntity>,
  ) {}

  async insert_OLD(dto: QuizQuestionsEntity): Promise<QuizQuestionsEntity> {
    return this.repository_OLD.save(dto);
  }

  async insert(dto: NewQuizQuestionsEntity): Promise<NewQuizQuestionsEntity> {
    return this.repository.save(dto);
  }

  async findFiveRandom(): Promise<QuizQuestionsEntity[]> {
    return this.repository_OLD
      .createQueryBuilder('q')
      .select('q.*')
      .orderBy('RANDOM()')
      .addOrderBy('id', 'ASC')
      .limit(5)
      .getRawMany();
  }

  async findOneById(id: string): Promise<QuizQuestionsEntity | null> {
    return this.repository_OLD.findOneBy({ id });
  }

  async update(dto: QuizQuestionsEntity) {
    await this.repository_OLD.save(dto);
  }

  async softRemove(QuizQuestion: QuizQuestionsEntity): Promise<void> {
    await this.repository_OLD.softRemove(QuizQuestion);
  }

  async clear(): Promise<void> {
    await this.repository_OLD.query('TRUNCATE TABLE "quiz-questions" CASCADE');
  }
}
