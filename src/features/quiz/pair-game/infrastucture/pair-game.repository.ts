import {Injectable} from '@nestjs/common';
import { PairGameRepositoryTypeOrm } from './postgresq/pair-game.repository-typeorm';
import {PairGamesEntity, QuizPairGameStatusType} from '../domain/pair-games.entity';

@Injectable()
export class PairGameRepository {
  constructor(protected repository: PairGameRepositoryTypeOrm) {}

  async createGame(game: PairGamesEntity): Promise<PairGamesEntity | null | undefined> {
      return this.repository.create(game);
  }

  async getGameById(id: string): Promise<PairGamesEntity | null | undefined> {
    return this.repository.getById( id )
  }

  async updateGame(game: PairGamesEntity) {
    return this.repository.update(game);
  }

  async getActiveGameByUserId(userId: string, status: string): Promise<PairGamesEntity | null | undefined> {
    return this.repository.getActiveGame(userId, status);
  }

  async getUnfinishedGameByUserId(userId: string): Promise<PairGamesEntity | null> {
    return this.repository.getOneUnfinished(userId);
  }

  async getPairGamesByStatus(status: QuizPairGameStatusType) {
    return this.repository.getByStatus(status);
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
