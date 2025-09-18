import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuizPairGameEntity,
  QuizPairGameStatusType,
} from '../../domain/pair-game.entity';
import { Repository } from 'typeorm';
import { NewPairGameEntity } from '../../domain/new-pair-game.entity';

@Injectable()
export class PairGameRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuizPairGameEntity)
    protected repository_OLD: Repository<QuizPairGameEntity>,
    @InjectRepository(NewPairGameEntity)
    protected repository: Repository<NewPairGameEntity>,
  ) {}
  // async getById_OLD(id: string): Promise<QuizPairGameEntity | null | undefined> {
  //   return this.getQuizPairGameBuilder
  //       .where('pg."id" = :id', { id })
  //       .getOne();
  // }

  async getById(id: string): Promise<NewPairGameEntity | null | undefined> {
    return this.getGameBuilder
      .where('pg."id" = :id', { id })
      .getOne();
  }

  // async getByStatus(status: QuizPairGameStatusType) {
  //   return this.repository
  //     .createQueryBuilder('pg')
  //     .where('pg.status = :status', { status })
  //     .getOne();
  // }

  async getByStatus(status: QuizPairGameStatusType) {
    return this.repository
      .createQueryBuilder('pg')
      .where('pg.status = :status', { status })
      .getOne();
  }

  // async getOneActive_OLD(
  //   userId: string,
  // ): Promise<QuizPairGameEntity | null | undefined> {
  //   return this.getQuizPairGameBuilder
  //     .where('pg.status = :status', { status: 'Active' })
  //     .andWhere('pg.firstPlayer.id = :userId', { userId })
  //     .orWhere('pg.status = :status', { status: 'Active' })
  //     .andWhere('pg.secondPlayer.id = :userId', { userId })
  //     .getOne();
  // }

  async getActiveGame(
      userId: string,
      status: string
  ): Promise<NewPairGameEntity | null | undefined> {
    return this.getGameBuilder
        .where('pg.status = :status')
        .andWhere('firstUser.id = :userId')
        .orWhere('pg.status = :status')
        .andWhere('secondUser.id = :userId')
        .setParameters({ status, userId })
        .getOne();
  }

  // async getOneNotFinished_OLD(
  //   userId: string,
  // ): Promise<QuizPairGameEntity | null | undefined> {
  //   return this.getQuizPairGameBuilder
  //     .where('pg.finishGameDate IS NULL')
  //     .andWhere('pg.firstPlayer.id = :userId', { userId })
  //     .orWhere('pg.finishGameDate IS NULL')
  //     .andWhere('pg.secondPlayer.id = :userId', { userId })
  //     .getOne();
  // }

  async getOneNotFinished(
    userId: string,
  ): Promise<NewPairGameEntity | null> {
    return this.getGameBuilder
      .where('pg.finishGameDate IS NULL')
      .andWhere('firstUser.id = :userId')
      .orWhere('pg.finishGameDate IS NULL')
      .andWhere('secondUser.id = :userId')
      .setParameters({ userId })
      .getOne();
  }

  // async update_OLD(pairGame: QuizPairGameEntity) {
  //   return this.repository.save(pairGame);
  // }

  async update(game: NewPairGameEntity) {
    return this.repository.save(game);
  }

  // async create_OLD(
  //   pairGame: QuizPairGameEntity,
  // ): Promise<QuizPairGameEntity | null | undefined> {
  //   const createdPairGame = await this.repository.save(pairGame);
  //
  //   return this.getById(createdPairGame.id);
  // }

  async create(game: NewPairGameEntity): Promise<NewPairGameEntity | null | undefined> {
    const createdPairGame = await this.repository.save(game);

    return this.getById(createdPairGame.id);
  }

  async clear(): Promise<void> {
    //await this.repository_OLD.query('TRUNCATE TABLE "quiz-pair-game" CASCADE');
    await this.repository.query('TRUNCATE TABLE "new-pair-game" CASCADE');
  }

  // private get getQuizPairGameBuilder_OLD() {
  //   return this.repository
  //     .createQueryBuilder('pg')
  //     .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
  //     .leftJoinAndSelect('firstPlayer.accountData', 'firstAccountData')
  //     .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
  //     .leftJoinAndSelect('secondPlayer.accountData', 'secondAccountData')
  //     .select([
  //       'pg',
  //       'firstPlayer.id',
  //       'secondPlayer.id',
  //       'firstAccountData.login',
  //       'secondAccountData.login',
  //     ])
  //     .leftJoinAndSelect(
  //       'pg.answersFirstPlayer',
  //       'answersFirstPlayer',
  //       'firstPlayer.id = answersFirstPlayer.userId',
  //     )
  //     .leftJoinAndSelect(
  //       'pg.answersSecondPlayer',
  //       'answersSecondPlayer',
  //       'secondPlayer.id = answersSecondPlayer.userId',
  //     )
  //     .leftJoinAndSelect('pg.questions', 'questions')
  //     .orderBy('questions.id', 'ASC');
  // }

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
