import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PairGameQueryRepositoryTypeOrm } from './postgresq/pair-game.query.repository-typeorm';
import {
  CreatedPairGameOutputModel,
  createdPairGameOutputModel,
  gamesPagingOutputModel, newCreatedPairGameOutputModel, newGamesPagingOutputModel, newPlayerStatisticOutputModel,
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

  async newGetById(
      id: string,
      userId: string,
  ) {
    const game = await this.repository.newGetById(id);

    if (!game) throw new NotFoundException();

    const firstPlayerId = game.firstPlayer.user.id;
    const secondPlayer = game.secondPlayer;

    if (
        (firstPlayerId !== userId && !secondPlayer) ||
        (firstPlayerId !== userId && secondPlayer!.user.id !== userId)
    )
      throw new ForbiddenException();

    return newCreatedPairGameOutputModel(game);
  }

  async getByUserId(userId: string): Promise<CreatedPairGameOutputModel> {
    const pairGame = await this.repository.getByUserId(userId);

    if (!pairGame) throw new NotFoundException();

    return createdPairGameOutputModel(pairGame);
  }

  async newGetByUserId(userId: string) {
    const game = await this.repository.newGetByUserId(userId);

    if (!game) throw new NotFoundException();

    return newCreatedPairGameOutputModel(game);
  }

  async getPaging(userId: string, query: pairGameQuery) {
    const pairGames = await this.repository.getPaging(userId, query);

    const totalGames = await this.repository.getTotalGamesByUserId(userId);

    return gamesPagingOutputModel(pairGames, query, totalGames);
  }

  async newGetPaging(userId: string, query: pairGameQuery) {
    console.log('start newGetPaging')
    const pairGames = await this.repository.newGetPaging(userId, query);
    console.log('pairGames =', pairGames)
    const totalGames = await this.repository.newGetTotalGamesByUserId(userId);
    console.log('totalGames =', totalGames)
    return newGamesPagingOutputModel(pairGames, query, totalGames);
  }

  async getStatisticByUserId(userId: string) {
    const games = await this.repository.getStatisticByUserId(userId);

    return playerStatisticOutputModel(games, userId);
  }

  async newGetStatisticByUserId(userId: string) {
    const games = await this.repository.newGetStatisticByUserId(userId);

    return newPlayerStatisticOutputModel(games, userId);
  }
}
