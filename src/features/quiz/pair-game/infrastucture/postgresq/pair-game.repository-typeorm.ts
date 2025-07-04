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
    protected repository: Repository<QuizPairGameEntity>,
    @InjectRepository(NewPairGameEntity)
    protected newRepository: Repository<NewPairGameEntity>,
  ) {}
  async getById(id: string): Promise<QuizPairGameEntity | null | undefined> {
    return this.getQuizPairGameBuilder
        .where('pg."id" = :id', { id })
        .getOne();
  }

  async newGetById(id: string): Promise<NewPairGameEntity | null | undefined> {
    return this.newGetQuizPairGameBuilder
      .where('pg."id" = :id', { id })
      .getOne();
  }

  async getByStatus(status: QuizPairGameStatusType) {
    return this.repository
      .createQueryBuilder('pg')
      .where('pg.status = :status', { status })
      .getOne();
  }

  async newGetByStatus(status: QuizPairGameStatusType) {
    return this.newRepository
      .createQueryBuilder('pg')
      .where('pg.status = :status', { status })
      .getOne();
  }

  async getOneActive(
    userId: string,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.getQuizPairGameBuilder
      .where('pg.status = :status', { status: 'Active' })
      .andWhere('pg.firstPlayer.id = :userId', { userId })
      .orWhere('pg.status = :status', { status: 'Active' })
      .andWhere('pg.secondPlayer.id = :userId', { userId })
      .getOne();
  }

  async newGetActiveGame(
      userId: string,
      status: string
  ): Promise<NewPairGameEntity | null | undefined> {
    return this.newGetQuizPairGameBuilder
        .where('pg.status = :status')
        .andWhere('firstUser.id = :userId')
        .orWhere('pg.status = :status')
        .andWhere('secondUser.id = :userId')
        .setParameters({ status, userId })
        .getOne();
  }

  async getOneNotFinished(
    userId: string,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.getQuizPairGameBuilder
      .where('pg.finishGameDate IS NULL')
      .andWhere('pg.firstPlayer.id = :userId', { userId })
      .orWhere('pg.finishGameDate IS NULL')
      .andWhere('pg.secondPlayer.id = :userId', { userId })
      .getOne();
  }

  async newGetOneNotFinished(
    userId: string,
  ): Promise<NewPairGameEntity | null> {
    return this.newGetQuizPairGameBuilder
      .where('pg.finishGameDate IS NULL')
      .andWhere('firstUser.id = :userId')
      .orWhere('pg.finishGameDate IS NULL')
      .andWhere('secondUser.id = :userId')
      .setParameters({ userId })
      .getOne();
  }

  async update(pairGame: QuizPairGameEntity) {
    return this.repository.save(pairGame);
  }

  async newUpdate(game: NewPairGameEntity) {
    return this.newRepository.save(game);
  }

  async create(
    pairGame: QuizPairGameEntity,
  ): Promise<QuizPairGameEntity | null | undefined> {
    const createdPairGame = await this.repository.save(pairGame);

    return this.getById(createdPairGame.id);
  }

  async newCreate(game: NewPairGameEntity): Promise<NewPairGameEntity | null | undefined> {
    const createdPairGame = await this.newRepository.save(game);

    return this.newGetById(createdPairGame.id);
  }

  async clear(): Promise<void> {
    await this.repository.query('TRUNCATE TABLE "quiz-pair-game" CASCADE');
    await this.newRepository.query('TRUNCATE TABLE "new-pair-game" CASCADE');
  }

  private get getQuizPairGameBuilder() {
    return this.repository
      .createQueryBuilder('pg')
      .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
      .leftJoinAndSelect('firstPlayer.accountData', 'firstAccountData')
      .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
      .leftJoinAndSelect('secondPlayer.accountData', 'secondAccountData')
      .select([
        'pg',
        'firstPlayer.id',
        'secondPlayer.id',
        'firstAccountData.login',
        'secondAccountData.login',
      ])
      .leftJoinAndSelect(
        'pg.answersFirstPlayer',
        'answersFirstPlayer',
        'firstPlayer.id = answersFirstPlayer.userId',
      )
      .leftJoinAndSelect(
        'pg.answersSecondPlayer',
        'answersSecondPlayer',
        'secondPlayer.id = answersSecondPlayer.userId',
      )
      .leftJoinAndSelect('pg.questions', 'questions')
      .orderBy('questions.id', 'ASC');
  }

  private get newGetQuizPairGameBuilder() {
    return this.newRepository
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
