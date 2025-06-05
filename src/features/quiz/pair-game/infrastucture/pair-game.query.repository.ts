import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PairGameQueryRepositoryTypeOrm } from './postgresq/pair-game.query.repository-typeorm';
import {
  CreatedPairGameOutputModel,
  createdPairGameOutputModel,
  gamesPagingOutputModel,
  playerStatisticOutputModel,
} from '../api/models/output/pair-game.output.models';
import { QuizPairGameEntity } from '../domain/pair-game.entity';
import { pairGameQuery } from '../api/models/input/input-query.dto';

@Injectable()
export class PairGameQueryRepository {
  constructor(protected repository: PairGameQueryRepositoryTypeOrm) {}

  async getById(
    id: string,
    userId: string,
  ): Promise<CreatedPairGameOutputModel> {
    const pairGame = await this.repository.getById(id);

    if (!pairGame) throw new NotFoundException();

    if (
      (pairGame.firstPlayer.id !== userId && !pairGame.secondPlayer) ||
      (pairGame.firstPlayer.id !== userId &&
        pairGame.secondPlayer.id !== userId)
    )
      throw new ForbiddenException();

    return createdPairGameOutputModel(pairGame);
  }

  async getByUserId(userId: string): Promise<CreatedPairGameOutputModel> {
    const pairGame = await this.repository.getByUserId(userId);

    if (!pairGame) throw new NotFoundException();

    return createdPairGameOutputModel(pairGame);
  }

  async getPaging(userId: string, query: pairGameQuery) {
    const pairGames = await this.repository.getPaging(userId, query);

    const totalGames = await this.repository.getTotalGamesByUserId(userId);

    return gamesPagingOutputModel(pairGames, query, totalGames);
  }

  async getStatisticByUserId(userId: string) {
    const games = await this.repository.getStatisticByUserId(userId);

    return playerStatisticOutputModel(games, userId);
  }
}
