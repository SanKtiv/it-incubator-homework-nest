import { Injectable } from '@nestjs/common';
import { PairGameRepositoryTypeOrm } from './postgresq/pair-game.repository-typeorm';
import {
  QuizPairGameEntity,
  QuizPairGameStatusType,
} from '../domain/pair-game.entity';

@Injectable()
export class PairGameRepository {
  constructor(protected repository: PairGameRepositoryTypeOrm) {}

  async getActivePairGameByUserId(
    userId: string,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.repository.getOneActive(userId);
  }

  async getNotFinishedPairGameByUserId(
      userId: string,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.repository.getOneNotFinished(userId);
  }

  async getPairGamesByStatus(status: QuizPairGameStatusType) {
    return this.repository.getByStatus(status);
  }

  async createPairGame(
    pairGame: QuizPairGameEntity,
  ): Promise<QuizPairGameEntity | null | undefined> {
    return this.repository.create(pairGame);
  }

  async updatePairGame(pairGame: QuizPairGameEntity) {
    return this.repository.update(pairGame);
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
