import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { QuizPairGameEntity } from '../../domain/pair-game.entity';
import { DataSource, Repository } from 'typeorm';
import { pairGameQuery } from '../../api/models/input/input-query.dto';
import {NewPairGameEntity} from "../../domain/new-pair-game.entity";

@Injectable()
export class PairGameQueryRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuizPairGameEntity)
    protected repository: Repository<QuizPairGameEntity>,
    @InjectRepository(NewPairGameEntity)
    protected newRepository: Repository<NewPairGameEntity>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  private get building() {
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
      .leftJoinAndSelect('pg.questions', 'questions');
  }

  private get shareBuilder() {
        return this.newRepository
            .createQueryBuilder('pg')
            .select(['pg'])
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.user', 'user')
            .leftJoinAndSelect('user.accountData', 'userAccountData')
            .leftJoinAndSelect('pg.secondPlayer', 'sPlayer')
            .leftJoinAndSelect('sPlayer.user', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.accountData', 'secondAccountData')
            .addSelect(['firstPlayer.id'])
            // .select([
            //     'pg',
            //     'user.id',
            //     'secondPlayer.userId',
            //     'firstAccountData.login',
            //     'secondAccountData.login',
            // ])
            .leftJoinAndSelect(
                'firstPlayer.answers',
                'firstPlayerAnswers',
                'pg.id = firstPlayerAnswers.gameId',
            )
            .leftJoinAndSelect(
                'sPlayer.answers',
                'secondPlayerAnswers',
                'pg.id = secondPlayerAnswers.gameId',
            )
            .leftJoinAndSelect('pg.questions', 'questions')
            .orderBy('questions.index', 'ASC');
    }

  async getById(id: string): Promise<QuizPairGameEntity | null> {
    return this.building
      .where('pg."id" = :id', { id })
      .orderBy('questions.id', 'ASC')
      .getOne();
  }

  async newGetById(id: string): Promise<NewPairGameEntity | null> {
        return this.shareBuilder
            .where('pg."id" = :id', { id })
            .getOne();
    }

  async getByUserId(userId: string): Promise<QuizPairGameEntity | null> {
    return this.building
      .where('pg.finishGameDate IS NULL')
      .andWhere('pg.firstPlayer.id = :userId', { userId })
      .orWhere('pg.finishGameDate IS NULL')
      .andWhere('pg.secondPlayer.id = :userId', { userId })
      .orderBy('questions.id', 'ASC')
      .getOne();
  }

  async getPaging(
    userId: string,
    query: pairGameQuery,
  ): Promise<QuizPairGameEntity[]> {
    const idsSubQuery = this.repository
      .createQueryBuilder('pg')
      .select('pg.id')
      .where('pg.firstPlayer.id = :userId')
      .orWhere('pg.secondPlayer.id = :userId')
      .setParameters({ userId })
      .orderBy(`"${query.sortBy}"`, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize);

    if (query.sortBy !== 'pairCreatedDate') {
      idsSubQuery.addOrderBy('pg."pairCreatedDate"', 'DESC');
    }

    const gamesPaging = this.repository
      .createQueryBuilder('pg')
      .where(`pg.id IN (${idsSubQuery.getQuery()})`)
      .setParameters(idsSubQuery.getParameters())
      .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
      .leftJoinAndSelect(
        'pg.answersFirstPlayer',
        'answersFirstPlayer',
        'answersFirstPlayer.userId = firstPlayer.id',
      )
      .leftJoinAndSelect('firstPlayer.accountData', 'firstAccountData')
      .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
      .leftJoinAndSelect(
        'pg.answersSecondPlayer',
        'answersSecondPlayer',
        'answersSecondPlayer.userId = secondPlayer.id',
      )
      .leftJoinAndSelect('secondPlayer.accountData', 'secondAccountData')
      .leftJoinAndSelect('pg.questions', 'questions')
      .orderBy(`"${query.sortBy}"`, query.sortDirection);

    if (query.sortBy !== 'pairCreatedDate') {
      return gamesPaging
        .addOrderBy('pg."pairCreatedDate"', 'DESC')
        .addOrderBy('questions.id', 'ASC')
        .getMany();
    }

    return gamesPaging.addOrderBy('questions.id', 'ASC').getMany();
  }

  async getTotalGamesByUserId(userId: string): Promise<number> {
    return this.repository
      .createQueryBuilder('pg')
      .select('pg.id')
      .where('pg.firstPlayer.id = :userId')
      .orWhere('pg.secondPlayer.id = :userId')
      .setParameters({ userId })
      .getCount();
  }

  async getStatisticByUserId(userId: string): Promise<QuizPairGameEntity[]> {
    return this.repository
      .createQueryBuilder('pg')
      .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
      .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
      .select([
        'pg.status',
        'pg.firstPlayerScore',
        'pg.secondPlayerScore',
        'firstPlayer.id',
        'secondPlayer.id',
      ])
      .where('pg.firstPlayer.id = :userId', { userId })
      .orWhere('pg.secondPlayer.id = :userId', { userId })
      .getMany();
  }
}
