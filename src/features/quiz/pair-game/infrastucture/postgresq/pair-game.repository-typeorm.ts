import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizPairGameEntity, QuizPairGameStatusType} from "../../domain/pair-game.entity";
import {Repository, SelectQueryBuilder} from "typeorm";
import {AccountDataTable} from "../../../../users/domain/account-data.table";
import {UsersTable} from "../../../../users/domain/users.table";
import {QuizQuestionsEntity} from "../../../questions/domain/quiz-questions.entity";
import {AnswersGameEntity} from "../../domain/answers-game.entity";

@Injectable()
export class PairGameRepositoryTypeOrm {
    constructor(@InjectRepository(QuizPairGameEntity) protected repository: Repository<QuizPairGameEntity>) {
    }

    async getById(id: string): Promise<QuizPairGameEntity | null | undefined> {
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

    async getByStatus(status: QuizPairGameStatusType) {
        return this.repository
            .createQueryBuilder('pg')
            .where('pg.status = :status', { status })
            //.addSelect(this.getFirstPlayerLogin, 'firstPlayerLogin')
            //.addSelect(this.getSecondPlayerLogin, 'secondPlayerLogin')
            .getOne()
    }

    async getOne(userId: string): Promise<QuizPairGameEntity | null | undefined> {
        return this.repository
            .createQueryBuilder('pg')
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
            .where('pg.firstPlayer.id = :userId', { userId })
            .orWhere('pg.secondPlayer.id = :userId', { userId })
            .getOne()
    }

    async create(pairGame: QuizPairGameEntity): Promise<QuizPairGameEntity | null | undefined> {
        const createdPairGame = await this.repository.save(pairGame);
        return this.getById(createdPairGame.id);
    }

    async clear(): Promise<void> {
        await this.repository.query('TRUNCATE TABLE "quiz-pair-game" CASCADE');
    }

    private get builder() {
        return this.repository
            .createQueryBuilder('pg')
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.accountData', 'firstAccountData')
            .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.accountData', 'secondAccountData')
            .leftJoinAndSelect('pg.questions', 'questions')
            .select([
                'pg',
                'firstPlayer.id',
                'secondPlayer.id',
                'firstAccountData.login',
                'secondAccountData.login'
            ])
    }

    private getFirstPlayerLogin = (subQuery: SelectQueryBuilder<AccountDataTable>) =>
        subQuery
            .select('ac."login"')
            .from(UsersTable, 'u')
            .leftJoin(AccountDataTable, 'ac', 'ac."id" = u."accountDataId"')
            .where('u."id" = pg."firstPlayerId"')

    private getSecondPlayerLogin = (subQuery: SelectQueryBuilder<AccountDataTable>) =>
        subQuery
            .select('ac."login"')
            .from(UsersTable, 'u')
            .leftJoin(AccountDataTable, 'ac', 'ac."id" = u."accountDataId"')
            .where('pg."secondPlayerId" = u."id"')

    private getQuestions = (subQuery: SelectQueryBuilder<QuizQuestionsEntity>) =>
        subQuery
            .select(['q.*'])
            .from(QuizQuestionsEntity, 'q')

}