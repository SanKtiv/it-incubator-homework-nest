import {Controller, Get, Post, UseGuards} from "@nestjs/common";
import {PairGameQuizPairsServices} from "../application/pair-game.services";
import {JWTAccessAuthGuard} from "../../../../infrastructure/guards/jwt-access-auth.guard";
import {CurrentUserId} from "../../../auth/infrastructure/decorators/current-user-id.param.decorator";

@Controller('pair-game-quiz/pairs')
export class PairGameQuizPairsController {
    constructor(protected pairGameServices: PairGameQuizPairsServices) {
    }

    @Post('connection')
    @UseGuards(JWTAccessAuthGuard)
    async createOrJoinPairGame(@CurrentUserId() userId: string,) {
        return this.pairGameServices.createOrJoinPairGame(userId)
    }

    @Get('my-current')
    async getMyCurrentPairGame() {

    }
}