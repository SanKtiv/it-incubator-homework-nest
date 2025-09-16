import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PairGameQueryRepositoryTypeOrm } from './postgresq/pair-game.query.repository-typeorm';
import {
  CreatedPairGameOutputModel,
  createdPairGameOutputModel,
  gamesPagingOutputModel, outputModelCreatedPairGame, outputModelPairGamesPagination, outputModelPlayerStatistic,
  playerStatisticOutputModel,
} from '../api/models/output/pair-game.output.models';
import { QuizPairGameEntity } from '../domain/pair-game.entity';
import { pairGameQuery } from '../api/models/input/input-query.dto';

@Injectable()
export class PairGameQueryRepository {
  constructor(protected repository: PairGameQueryRepositoryTypeOrm) {}

  async getById(id: string, userId: string) {
    const game = await this.repository.getById(id);

    if (!game) throw new NotFoundException();

    const firstPlayerId = game.firstPlayer.user.id;
    const secondPlayer = game.secondPlayer;

    if (
        (firstPlayerId !== userId && !secondPlayer) ||
        (firstPlayerId !== userId && secondPlayer!.user.id !== userId)
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

    const totalGames = await this.repository.getTotalGamesByUserId(userId);

    return outputModelPairGamesPagination(pairGames, query, totalGames);
  }

  async getStatisticByUserId(userId: string) {
    const games = await this.repository.getStatisticByUserId(userId);

    return outputModelPlayerStatistic(games, userId);
  }

  // async getById_OLD(id: string, userId: string): Promise<CreatedPairGameOutputModel> {
  //   const pairGame = await this.repository.getById_OLD(id);
  //
  //   if (!pairGame) throw new NotFoundException();
  //
  //   if (
  //     (pairGame.firstPlayer.id !== userId && !pairGame.secondPlayer) ||
  //     (pairGame.firstPlayer.id !== userId &&
  //       pairGame.secondPlayer.id !== userId)
  //   )
  //     throw new ForbiddenException();
  //
  //   return createdPairGameOutputModel(pairGame);
  // }
  //
  // async getByUserId_OLD(userId: string): Promise<CreatedPairGameOutputModel> {
  //   const pairGame = await this.repository.getByUserId_OLD(userId);
  //
  //   if (!pairGame) throw new NotFoundException();
  //
  //   return createdPairGameOutputModel(pairGame);
  // }
  //
  // async getPaging_OLD(userId: string, query: pairGameQuery) {
  //   const pairGames = await this.repository.getPaging_OLD(userId, query);
  //
  //   const totalGames = await this.repository.getTotalGamesByUserId_OLD(userId);
  //
  //   return gamesPagingOutputModel(pairGames, query, totalGames);
  // }
  //
  // async getStatisticByUserId_OLD(userId: string) {
  //   const games = await this.repository.getStatisticByUserId_OLD(userId);
  //
  //   return playerStatisticOutputModel(games, userId);
  // }
}
