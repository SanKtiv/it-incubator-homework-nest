import {Controller, Get, Post} from "@nestjs/common";

@Controller('pair-game-quiz/pairs')
export class PairGameQuizPairsController {
    constructor() {
    }

    @Post('connection')
    async createOrJoinPairGame() {

    }

    @Get('my-current')
    async getMyCurrentPairGame() {

    }
}