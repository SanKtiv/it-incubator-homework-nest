import { Injectable } from '@nestjs/common';
import { PairGameRepositoryTypeOrm } from './postgresq/pair-game.repository-typeorm';
import {QuizPairGameStatusType} from '../domain/pair-game.entity';
import { NewPairGameEntity } from '../domain/new-pair-game.entity';

@Injectable()
export class PairGameRepository {
  constructor(protected repository: PairGameRepositoryTypeOrm) {}

  async createPairGame(game: NewPairGameEntity): Promise<NewPairGameEntity | null | undefined> {
    try {
      const result = await this.repository.create(game);
      return result;
    }
    catch (e) {
      console.log('ERROR in newCreatePairGame -', e)
    }
  }

  async updatePairGame(game: NewPairGameEntity) {
    try {
      const res = await this.repository.update(game);
      return res;
    }
    catch (e) {
      console.log('ERROR', e)
    }
  }

  async getActiveGameByUserId(userId: string, status: string): Promise<NewPairGameEntity | null | undefined> {
    return this.repository.getActiveGame(userId, status);
  }

  async getNotFinishedPairGameByUserId(userId: string): Promise<NewPairGameEntity | null> {
    return this.repository.getOneNotFinished(userId);
  }

  async getPairGamesByStatus(status: QuizPairGameStatusType) {
    return this.repository.getByStatus(status);
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
