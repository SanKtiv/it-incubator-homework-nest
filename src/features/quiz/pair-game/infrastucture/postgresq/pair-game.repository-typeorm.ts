import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {NewPairGameEntity, QuizPairGameStatusType} from '../../domain/new-pair-game.entity';

@Injectable()
export class PairGameRepositoryTypeOrm {
  constructor(
    @InjectRepository(NewPairGameEntity)
    protected repository: Repository<NewPairGameEntity>,
  ) {}

  async getById(id: string): Promise<NewPairGameEntity | null | undefined> {
    return this.getGameBuilder
      .where('pg."id" = :id', { id })
      .getOne();
  }

  async getByStatus(status: QuizPairGameStatusType) {
    return this.repository
      .createQueryBuilder('pg')
      .where('pg.status = :status', { status })
      .getOne();
  }

  async getActiveGame(userId: string, status: string): Promise<NewPairGameEntity | null | undefined> {
    return this.getGameBuilder
        .where('pg.status = :status')
        .andWhere('firstUser.id = :userId')
        .orWhere('pg.status = :status')
        .andWhere('secondUser.id = :userId')
        .setParameters({ status, userId })
        .getOne();
  }

  async getOneNotFinished(userId: string): Promise<NewPairGameEntity | null> {
    return this.getGameBuilder
      .where('pg.finishGameDate IS NULL')
      .andWhere('firstUser.id = :userId')
      .orWhere('pg.finishGameDate IS NULL')
      .andWhere('secondUser.id = :userId')
      .setParameters({ userId })
      .getOne();
  }

  async update(game: NewPairGameEntity) {
    return this.repository.save(game);
  }

  async create(game: NewPairGameEntity): Promise<NewPairGameEntity | null | undefined> {
    const createdPairGame = await this.repository.save(game);

    return this.getById(createdPairGame.id);
  }

  async clear(): Promise<void> {
    //await this.repository_OLD.query('TRUNCATE TABLE "quiz-pair-game" CASCADE');
    await this.repository.query('TRUNCATE TABLE "new-pair-game" CASCADE');
  }

  private get getGameBuilder() {
    return this.repository
        .createQueryBuilder('pg')
        .select(['pg'])
        .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
        .leftJoinAndSelect('firstPlayer.user', 'firstUser')
        .leftJoinAndSelect('firstUser.accountData', 'firstAccountData')
        .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
        .leftJoinAndSelect('secondPlayer.user', 'secondUser')
        .leftJoinAndSelect('secondUser.accountData', 'secondAccountData')
        .leftJoinAndSelect(
            'firstPlayer.answers',
            'firstPlayerAnswers',
            'pg.id = firstPlayerAnswers.gameId',
        )
        .leftJoinAndSelect(
            'secondPlayer.answers',
            'secondPlayerAnswers',
            'pg.id = secondPlayerAnswers.gameId',
        )
        .leftJoinAndSelect('pg.questions', 'questions')
        .leftJoinAndSelect('questions.questions', 'question')
        .orderBy('questions.index', 'ASC');
  }
}
