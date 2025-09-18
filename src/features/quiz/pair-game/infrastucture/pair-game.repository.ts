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

  async getActivePairGameByUserId_OLD(
    userId: string,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.repository.getOneActive(userId);
  }

  async getActiveGameByUserId(
      userId: string,
      status: string
  ): Promise<NewPairGameEntity | null | undefined> {
    return this.repository.getActiveGame(userId, status);
  }

  // async getNotFinishedPairGameByUserId_OLD(
  //   userId: string,
  // ): Promise<QuizPairGameEntity | null | undefined> {
  //   return this.repository.getOneNotFinished(userId);
  // }

  async getNotFinishedPairGameByUserId(
    userId: string,
  ): Promise<NewPairGameEntity | null> {
    return this.repository.getOneNotFinished(userId);
  }

  // async getPairGamesByStatus(status: QuizPairGameStatusType) {
  //   return this.repository.getByStatus(status);
  // }

  async getPairGamesByStatus(status: QuizPairGameStatusType) {
    return this.repository.getByStatus(status);
  }

  // async createPairGame_OLD(
  //   pairGame: QuizPairGameEntity,
  // ): Promise<QuizPairGameEntity | null | undefined> {
  //   return this.repository.create(pairGame);
  // }

  async createPairGame(
    game: NewPairGameEntity,
  ): Promise<NewPairGameEntity | null | undefined> {
    try {
      const result = await this.repository.newCreate(game);
      return result;
    }
    catch (e) {
      console.log('ERROR in newCreatePairGame -', e)
    }
  }

  // async updatePairGame_OLD(pairGame: QuizPairGameEntity) {
  //   return this.repository.update(pairGame);
  // }

  async updatePairGame(game: NewPairGameEntity) {
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
