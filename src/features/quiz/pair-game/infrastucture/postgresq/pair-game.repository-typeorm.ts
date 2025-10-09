import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PairGamesEntity, QuizPairGameStatusType} from '../../domain/pair-games.entity';

@Injectable()
export class PairGameRepositoryTypeOrm {
    constructor(
        @InjectRepository(PairGamesEntity)
        protected repository: Repository<PairGamesEntity>,
    ) {
    }

    async getById(id: string): Promise<PairGamesEntity | null | undefined> {
        return this.getGameBuilder
            .where('game."id" = :id', {id})
            .getOne();
    }

    async getByStatus(status: QuizPairGameStatusType) {
      return this.repository.findOne({
        where: {
          status: status,
        }
      })
        // return this.repository
        //     .createQueryBuilder('game')
        //     .where('game.status = :status')
        //     .setParameters({status})
        //     .getOne();
    }

    async getActiveGame(userId: string, status: string): Promise<PairGamesEntity | null | undefined> {
        return this.getGameBuilder
            .where('game.status = :status')
            .andWhere('firstUser.id = :userId')
            .orWhere('game.status = :status')
            .andWhere('secondUser.id = :userId')
            .setParameters({status, userId})
            .getOne();
    }

    async getOneUnfinished(userId: string): Promise<PairGamesEntity | null> {

        return this.repository
            .createQueryBuilder('game')
            .leftJoin('game.firstPlayer', 'firstPlayer')
            .leftJoin('firstPlayer.user', 'firstUser')
            .leftJoin('game.secondPlayer', 'secondPlayer')
            .leftJoin('secondPlayer.user', 'secondUser')
            .where('game.finishGameDate IS NULL')
            .andWhere('firstUser.id = :userId')
            .orWhere('game.finishGameDate IS NULL')
            .andWhere('secondUser.id = :userId')
            .setParameters({userId})
            .getOne()
        // return this.getGameBuilder
        //     .where('game.finishGameDate IS NULL')
        //     .andWhere('firstUser.id = :userId')
        //     .orWhere('game.finishGameDate IS NULL')
        //     .andWhere('secondUser.id = :userId')
        //     .setParameters({ userId })
        //     .getOne();
    }

    async update(game: PairGamesEntity) {
        return this.repository.save(game);
    }

    async create(game: PairGamesEntity): Promise<PairGamesEntity | null | undefined> {
        const createdPairGame = await this.repository.save(game);

        return this.getById(createdPairGame.id);
    }

    async clear(): Promise<void> {
        //await this.repository_OLD.query('TRUNCATE TABLE "quiz-pair-game" CASCADE');
        await this.repository.query('TRUNCATE TABLE "pair-game" CASCADE');
    }

    private get getGameBuilder() {
        return this.repository
            .createQueryBuilder('game')
            .select(['game'])
            .leftJoinAndSelect('game.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.user', 'firstUser')
            .leftJoinAndSelect('firstUser.accountData', 'firstAccountData')
            .leftJoinAndSelect('firstUser.statistic', 'firstStatistic')
            .leftJoinAndSelect('game.secondPlayer', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.user', 'secondUser')
            .leftJoinAndSelect('secondUser.accountData', 'secondAccountData')
            .leftJoinAndSelect('secondUser.statistic', 'secondStatistic')
            .leftJoinAndSelect(
                'firstPlayer.answers',
                'firstPlayerAnswers',
                'game.id = firstPlayerAnswers.gameId',
            )
            .leftJoinAndSelect(
                'secondPlayer.answers',
                'secondPlayerAnswers',
                'game.id = secondPlayerAnswers.gameId',
            )
            .leftJoinAndSelect('game.questions', 'questions')
            .leftJoinAndSelect('questions.question', 'question')
            .orderBy('questions.index', 'ASC');
    }
}
