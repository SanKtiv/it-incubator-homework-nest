import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PairGameQueryRepositoryTypeOrm } from './postgresq/pair-game.query.repository-typeorm';
import {
  outputModelCreatedPairGame,
  outputModelPairGamesPagination,
  outputModelPlayerStatistic,
  outputModelStatisticTopUsers
} from '../api/models/output/pair-game.output.models';
import {GameQueryTopUsers, pairGameQuery} from '../api/models/input/input-query.dto';
import {UsersQueryRepositoryTypeOrm} from "../../../users/infrastructure/postgresqldb/users.query.repository-typeorm";

@Injectable()
export class PairGameQueryRepository {
  constructor(protected repository: PairGameQueryRepositoryTypeOrm,
              protected repositoryUsers: UsersQueryRepositoryTypeOrm) {}

  async getById(id: string, userId: string) {
    const game = await this.repository.getById(id);

    if (!game) throw new NotFoundException();

    const [firstPlayer, secondPlayer] = game.players;

    if (
        (firstPlayer.user.id !== userId && !secondPlayer) ||
        (firstPlayer.user.id !== userId && secondPlayer!.user.id !== userId)
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

  async getStatisticOfGamePlayers(query: GameQueryTopUsers) {
    const statistic = await this.repository.getTop(query);

    const totalPlayers = await this.repositoryUsers.usersWithPlayers()

    return outputModelStatisticTopUsers(statistic, totalPlayers, query);
  }
}
