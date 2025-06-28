import { Injectable } from '@nestjs/common';
import { PairGameRepositoryTypeOrm } from './postgresq/pair-game.repository-typeorm';
import {
  QuizPairGameEntity,
  QuizPairGameStatusType,
} from '../domain/pair-game.entity';
import { NewPairGameEntity } from '../domain/new-pair-game.entity';

@Injectable()
export class PairGameRepository {
  constructor(protected repository: PairGameRepositoryTypeOrm) {}

  async getActivePairGameByUserId(
    userId: string,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.repository.getOneActive(userId);
  }

  async newGetActiveGameByUserId(
      userId: string,
      status: string
  ): Promise<NewPairGameEntity | null | undefined> {
    return this.repository.newGetActiveGame(userId, status);
  }

  async getNotFinishedPairGameByUserId(
    userId: string,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.repository.getOneNotFinished(userId);
  }

  async newGetNotFinishedPairGameByUserId(
    userId: string,
  ): Promise<NewPairGameEntity | null> {
    return this.repository.newGetOneNotFinished(userId);
  }

  async getPairGamesByStatus(status: QuizPairGameStatusType) {
    return this.repository.getByStatus(status);
  }

  async newGetPairGamesByStatus(status: QuizPairGameStatusType) {
    return this.repository.newGetByStatus(status);
  }

  async createPairGame(
    pairGame: QuizPairGameEntity,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.repository.create(pairGame);
  }

  async newCreatePairGame(
    game: NewPairGameEntity,
  ): Promise<NewPairGameEntity | null | undefined> {
    return this.repository.newCreate(game);
  }

  async updatePairGame(pairGame: QuizPairGameEntity) {
    return this.repository.update(pairGame);
  }

  async newUpdatePairGame(game: NewPairGameEntity) {
    try {
      const res = await this.repository.newUpdate(game);
      return res;
    }
    catch (e) {
      console.log('ERROR', e)
    }
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
