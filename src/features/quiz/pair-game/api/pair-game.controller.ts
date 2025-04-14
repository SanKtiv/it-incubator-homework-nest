import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import {PairGameQuizPairsServices} from "../application/pair-game.services";
import {JWTAccessAuthGuard} from "../../../../infrastructure/guards/jwt-access-auth.guard";
import {CurrentUserId} from "../../../auth/infrastructure/decorators/current-user-id.param.decorator";
import {PairGameQueryRepository} from "../infrastucture/pair-game.query.repository";
import {InputAnswersModels} from "./models/input/input-answers.models";

@Controller('pair-game-quiz/pairs')
export class PairGameQuizPairsController {
    constructor(
        protected pairGameServices: PairGameQuizPairsServices,
        protected pairGameQueryRepository: PairGameQueryRepository
    ) {
    }

    @Post('connection')
    @UseGuards(JWTAccessAuthGuard)
    async createOrJoinPairGame(@CurrentUserId() userId: string,) {
        return this.pairGameServices.createOrJoinPairGame(userId)
    }

    @Get(':id')
    @UseGuards(JWTAccessAuthGuard)
    async getPairGameById(@Param('id') id: string) {
        return this.pairGameQueryRepository.getById(id)
    }

    @Get('my-current')
    async getMyCurrentPairGame() {

    }

    @Post('my-current/answers')
    @UseGuards(JWTAccessAuthGuard)
    async createAnswerPlayer(
        @CurrentUserId() userId: string,
        @Body() dto: InputAnswersModels
    ) {
        return this.pairGameServices.createAnswerPlayer(userId, dto)
    }
}