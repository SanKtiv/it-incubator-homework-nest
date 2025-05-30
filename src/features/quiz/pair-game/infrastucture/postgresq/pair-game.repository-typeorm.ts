import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {
    QuizPairGameEntity,
    QuizPairGameStatusType,
} from '../../domain/pair-game.entity';
import {Repository} from 'typeorm';

@Injectable()
export class PairGameRepositoryTypeOrm {
    constructor(
        @InjectRepository(QuizPairGameEntity)
        protected repository: Repository<QuizPairGameEntity>,
    ) {
    }
    async getById(id: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.getQuizPairGameBuilder
            //.orderBy('questions.id', 'ASC')
            .where('pg."id" = :id', {id})
            .getOne();
    }

    async getByStatus(status: QuizPairGameStatusType) {
        return this.repository
            .createQueryBuilder('pg')
            .where('pg.status = :status', {status})
            .getOne();
    }

    async getOneActive(userId: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.getQuizPairGameBuilder
            .where('pg.status = :status', {status: 'Active'})
            .andWhere('pg.firstPlayer.id = :userId', {userId})
            .orWhere('pg.status = :status', {status: 'Active'})
            .andWhere('pg.secondPlayer.id = :userId', {userId})
            //.orderBy('questions.id', 'ASC')
            .getOne();
    }

    async getOneNotFinished(userId: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.getQuizPairGameBuilder
            .where('pg.finishGameDate IS NULL')
            .andWhere('pg.firstPlayer.id = :userId', {userId})
            .orWhere('pg.finishGameDate IS NULL')
            .andWhere('pg.secondPlayer.id = :userId', {userId})
            //.orderBy('questions.id', 'ASC')
            .getOne();
    }

    async update(pairGame: QuizPairGameEntity) {
        return this.repository.save(pairGame);
    }

    async create(
        pairGame: QuizPairGameEntity,
    ): Promise<QuizPairGameEntity | null | undefined> {
        const createdPairGame = await this.repository.save(pairGame);

        return this.getById(createdPairGame.id);
    }

    async clear(): Promise<void> {
        await this.repository.query('TRUNCATE TABLE "quiz-pair-game" CASCADE');
    }

    private get getQuizPairGameBuilder() {
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
            .orderBy('questions.id', 'ASC');
    }
}
