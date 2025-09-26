import { Injectable } from '@nestjs/common';
import { QuizQuestionsInputDto } from '../../api/models/quiz-questions.input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {NewQuizQuestionsEntity,
  // QuizQuestionsEntity
} from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizQuestionsRepositoryTypeOrm {
  constructor(
    // @InjectRepository(QuizQuestionsEntity) protected repository_OLD: Repository<QuizQuestionsEntity>,
    @InjectRepository(NewQuizQuestionsEntity) protected repository: Repository<NewQuizQuestionsEntity>,
  ) {}

  async insert(dto: NewQuizQuestionsEntity): Promise<NewQuizQuestionsEntity> {
    return this.repository.save(dto);
  }

  async findOneById(id: string): Promise<NewQuizQuestionsEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async update(dto: NewQuizQuestionsEntity) {
    await this.repository.save(dto);
  }

  async getFiveRandom(): Promise<NewQuizQuestionsEntity[]> {
    return this.repository
        .createQueryBuilder('q')
        .select(['q'])
        .orderBy('RANDOM()')
        .limit(5)
        .getMany();
  }

  async softRemove(QuizQuestion: NewQuizQuestionsEntity): Promise<void> {
    await this.repository.softRemove(QuizQuestion);
  }

  async clear(): Promise<void> {
    await this.repository.query('TRUNCATE TABLE "new_quiz-questions" CASCADE');
  }

  // async insert_OLD(dto: QuizQuestionsEntity): Promise<QuizQuestionsEntity> {
  //   return this.repository_OLD.save(dto);
  // }

  // async findFiveRandom_OLD(): Promise<QuizQuestionsEntity[]> {
  //   return this.repository_OLD
  //     .createQueryBuilder('q')
  //     .select('q.*')
  //     .orderBy('RANDOM()')
  //     .addOrderBy('id', 'ASC')
  //     .limit(5)
  //     .getRawMany();
  // }

  // async findOneById_OLD(id: string): Promise<QuizQuestionsEntity | null> {
  //   return this.repository_OLD.findOneBy({ id });
  // }
  //
  // async update_OLD(dto: QuizQuestionsEntity) {
  //   await this.repository_OLD.save(dto);
  // }
  //
  // async softRemove_OLD(QuizQuestion: QuizQuestionsEntity): Promise<void> {
  //   await this.repository_OLD.softRemove(QuizQuestion);
  // }
  //
  // async clear_OLD(): Promise<void> {
  //   await this.repository_OLD.query('TRUNCATE TABLE "quiz-questions" CASCADE');
  // }
}
