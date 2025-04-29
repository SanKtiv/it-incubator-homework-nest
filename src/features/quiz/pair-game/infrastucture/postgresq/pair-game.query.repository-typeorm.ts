import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {QuizPairGameEntity} from '../../domain/pair-game.entity';
import {Repository} from 'typeorm';

@Injectable()
export class PairGameQueryRepositoryTypeOrm {
    constructor(
        @InjectRepository(QuizPairGameEntity)
        protected repository: Repository<QuizPairGameEntity>,
    ) {
    }
    private get building() {
        return this.repository
            .createQueryBuilder('pg')
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.accountData', 'firstAccountData')
            .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.accountData', 'secondAccountData')
            .select([
                'pg',
                'firstPlayer.id',
                'secondPlayer.id',
                'firstAccountData.login',
                'secondAccountData.login',
            ])
            .leftJoinAndSelect(
                'pg.answersFirstPlayer',
                'answersFirstPlayer',
                'firstPlayer.id = answersFirstPlayer.userId',
            )
            .leftJoinAndSelect(
                'pg.answersSecondPlayer',
                'answersSecondPlayer',
                'secondPlayer.id = answersSecondPlayer.userId',
            )
            .leftJoinAndSelect('pg.questions', 'questions')
    }

    async getById(id: string): Promise<QuizPairGameEntity | null> {
        return this.building.where('pg."id" = :id', {id}).getOne();

        // const query = this.repository
        //     .createQueryBuilder('pg')
        //     .leftJoinAndSelect('pg.questions', 'questions')
        //     .select(['pg'])
        //     .where('pg."id" = :id', {id})
        //     .getQueryAndParameters()
        // console.log('LOG query =', query)
        // return this.repository
        //     .createQueryBuilder('pg')
        //     .leftJoinAndSelect('pg.questions', 'questions')
        //     .select(['pg'])
        //     .where('pg."id" = :id', {id})
        //     .getOne();
    }

    async getByUserId(userId: string): Promise<QuizPairGameEntity | null> {
        return this.building
            //.where('(pg.finishGameDate IS NULL AND pg.firstPlayer.id = :userId) OR (pg.finishGameDate IS NULL AND pg.secondPlayer.id = :userId)', {userId})
            .where('pg.finishGameDate IS NULL')
            .andWhere('pg.firstPlayer.id = :userId', {userId})
            .orWhere('pg.finishGameDate IS NULL')
            .andWhere('pg.secondPlayer.id = :userId', {userId})
            .getOne();
    }
}
