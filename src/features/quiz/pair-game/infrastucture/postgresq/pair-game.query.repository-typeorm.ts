import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizPairGameEntity} from "../../domain/pair-game.entity";
import {Repository} from "typeorm";

@Injectable()
export class PairGameQueryRepositoryTypeOrm {
    constructor(@InjectRepository(QuizPairGameEntity) protected repository: Repository<QuizPairGameEntity>) {
    }

    async getById(id: string) {
        return this.repository
            .createQueryBuilder('pg')
            .where('pg."id" = :id', { id })
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.accountData', 'firstAccountData')
            .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.accountData', 'secondAccountData')
            .select([
                'pg',
                'firstPlayer.id',
                'secondPlayer.id',
                'firstAccountData.login',
                'secondAccountData.login'
            ])
            .leftJoinAndSelect('pg.answersFirstPlayer',
                'answersFirstPlayer',
                'firstPlayer.id = answersFirstPlayer.userId')
            .leftJoinAndSelect('pg.answersSecondPlayer',
                'answersSecondPlayer',
                'secondPlayer.id = answersSecondPlayer.userId')
            .leftJoinAndSelect('pg.questions', 'questions')
            .getOne()
    }
}