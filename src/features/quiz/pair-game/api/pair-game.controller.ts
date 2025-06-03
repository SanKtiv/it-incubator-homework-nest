import {Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards} from '@nestjs/common';
import { PairGameQuizPairsServices } from '../application/pair-game.services';
import { JWTAccessAuthGuard } from '../../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { PairGameQueryRepository } from '../infrastucture/pair-game.query.repository';
import { InputAnswersModels } from './models/input/input-answers.models';
import {idPairGamePipe} from "../../../../infrastructure/pipes/validation.pipe";
import {pairGameQuery} from "./models/input/input-query.dto";
import {AnswerPlayerOutputModel, CreatedPairGameOutputModel} from "./models/output/pair-game.output.models";

@Controller('pair-game-quiz')
export class PairGameQuizPairsController {
  constructor(
    protected pairGameServices: PairGameQuizPairsServices,
    protected pairGameQueryRepository: PairGameQueryRepository,
  ) {}

  @Get('pairs/my-current')
  @UseGuards(JWTAccessAuthGuard)
  async getMyCurrentPairGame(@CurrentUserId() userId: string): Promise< CreatedPairGameOutputModel > {
    return this.pairGameQueryRepository.getByUserId(userId);
  }

  @Get('pairs/my')
  @UseGuards(JWTAccessAuthGuard)
  async getAllPairGamesCurrentUser(
      @CurrentUserId() userId: string,
      @Query() query: pairGameQuery) {
      return this.pairGameQueryRepository.getPaging(userId, query)
  }

  @Get('users/my-statistic')
  @UseGuards(JWTAccessAuthGuard)
  async getStatisticCurrentUser(@CurrentUserId() userId: string) {
      return this.pairGameQueryRepository.getStatisticByUserId(userId)
  }

  @Post('pairs/connection')
  @HttpCode(200)
  @UseGuards(JWTAccessAuthGuard)
  async createOrJoinPairGame(@CurrentUserId() userId: string): Promise<CreatedPairGameOutputModel> {
    return this.pairGameServices.createPairGame(userId);
  }

  @Post('pairs/my-current/answers')
  @HttpCode(200)
  @UseGuards(JWTAccessAuthGuard)
  async createAnswerPlayer(
      @CurrentUserId() userId: string,
      @Body() dto: InputAnswersModels,
  ): Promise<AnswerPlayerOutputModel> {
    return this.pairGameServices.addAnswerPlayerInPairGame(userId, dto);
  }

  @Get('pairs/:id')
  @UseGuards(JWTAccessAuthGuard)
  async getPairGameById(
      @Param('id', idPairGamePipe) id: string,
      @CurrentUserId() userId: string,
      ): Promise<CreatedPairGameOutputModel> {
    return this.pairGameQueryRepository.getById(id, userId);
  }
}
