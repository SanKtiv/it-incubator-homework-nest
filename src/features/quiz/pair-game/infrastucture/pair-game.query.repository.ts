import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PairGameQueryRepositoryTypeOrm } from './postgresq/pair-game.query.repository-typeorm';
import { outputModelCreatedPairGame, outputModelPairGamesPagination, outputModelPlayerStatistic } from '../api/models/output/pair-game.output.models';
import {GameQueryTopUsers, pairGameQuery} from '../api/models/input/input-query.dto';

@Injectable()
export class PairGameQueryRepository {
  constructor(protected repository: PairGameQueryRepositoryTypeOrm) {}

  async getById(id: string, userId: string) {
    const game = await this.repository.getById(id);

    if (!game) throw new NotFoundException();

    const firstPlayerUserId = game.firstPlayer.user.id;
    const secondPlayer = game.secondPlayer;

    if (
        (firstPlayerUserId !== userId && !secondPlayer) ||
        (firstPlayerUserId !== userId && secondPlayer!.user.id !== userId)
    )
      throw new ForbiddenException();

    return outputModelCreatedPairGame(game);
  }

  async getByUserId(userId: string) {
    const game = await this.repository.getByUserId(userId);

    if (!game) throw new NotFoundException();

    return outputModelCreatedPairGame(game);
  }

  async getPaging(userId: string, query: pairGameQuery) {
    const pairGames = await this.repository.getPaging(userId, query);

    const totalGames = await this.repository.getGamesByUserId(userId);

    return outputModelPairGamesPagination(pairGames, query, totalGames);
  }

  async getStatisticByUserId(userId: string) {
    const games = await this.repository.getStatisticByUserId(userId);

    return outputModelPlayerStatistic(games, userId);
  }

  async getTopUsersOfGame(query: GameQueryTopUsers) {
    return this.repository.getTopUsersOfGame(query)
  }
}
