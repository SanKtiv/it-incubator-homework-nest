import {Controller, Get, Post} from "@nestjs/common";
import {PairGameQuizPairsServices} from "../application/pair-game.services";

@Controller('pair-game-quiz/pairs')
export class PairGameQuizPairsController {
    constructor(protected pairGameServices: PairGameQuizPairsServices) {
    }

    @Post('connection')
    async createOrJoinPairGame() {
        return this.pairGameServices.createOrJoinPairGame()
    }

    @Get('my-current')
    async getMyCurrentPairGame() {

    }
}