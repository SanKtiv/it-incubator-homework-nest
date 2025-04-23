import {Body, Controller, Get, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import { PairGameQuizPairsServices } from '../application/pair-game.services';
import { JWTAccessAuthGuard } from '../../../../infrastructure/guards/jwt-access-auth.guard';
import { CurrentUserId } from '../../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { PairGameQueryRepository } from '../infrastucture/pair-game.query.repository';
import { InputAnswersModels } from './models/input/input-answers.models';
import {idPairGamePipe} from "../../../../infrastructure/pipes/validation.pipe";

@Controller('pair-game-quiz/pairs')
export class PairGameQuizPairsController {
  constructor(
    protected pairGameServices: PairGameQuizPairsServices,
    protected pairGameQueryRepository: PairGameQueryRepository,
  ) {}

  @Get('my-current')
  @UseGuards(JWTAccessAuthGuard)
  async getMyCurrentPairGame(@CurrentUserId() userId: string) {
    return this.pairGameQueryRepository.getByUserId(userId);
  }

  @Post('connection')
  @HttpCode(200)
  @UseGuards(JWTAccessAuthGuard)
  async createOrJoinPairGame(@CurrentUserId() userId: string) {
    return this.pairGameServices.createOrJoinPairGame(userId);
  }

  @Post('my-current/answers')
  @HttpCode(200)
  @UseGuards(JWTAccessAuthGuard)
  async createAnswerPlayer(
      @CurrentUserId() userId: string,
      @Body() dto: InputAnswersModels,
  ) {
    return this.pairGameServices.addAnswerPlayerInPairGame(userId, dto);
  }

  @Get(':id')
  @UseGuards(JWTAccessAuthGuard)
  async getPairGameById(
      @Param('id', idPairGamePipe) id: string,
      @CurrentUserId() userId: string,
      ) {
    return this.pairGameQueryRepository.getById(id, userId);
  }
}
