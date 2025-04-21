import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PairGameQueryRepositoryTypeOrm } from './postgresq/pair-game.query.repository-typeorm';
import {
  CreatedPairGameOutputModel,
  createdPairGameOutputModel,
} from '../api/models/output/pair-game.output.models';

@Injectable()
export class PairGameQueryRepository {
  constructor(protected repository: PairGameQueryRepositoryTypeOrm) {}

  async getById(id: string, userId: string): Promise<CreatedPairGameOutputModel> {
    const pairGame = await this.repository.getById(id);

    if (!pairGame) throw new NotFoundException();

    if (pairGame.firstPlayer.id !== userId && pairGame.secondPlayer.id !== userId)
      throw new ForbiddenException()

    return createdPairGameOutputModel(pairGame);
  }

  async getByUserId(userId: string): Promise<CreatedPairGameOutputModel> {
    const pairGame = await this.repository.getByUserId(userId);

    if (!pairGame) throw new NotFoundException();

    return createdPairGameOutputModel(pairGame);
  }
}
