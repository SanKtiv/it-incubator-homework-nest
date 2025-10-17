import {Injectable} from '@nestjs/common';
import {InjectDataSource, InjectRepository} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import {GameQueryTopUsers, pairGameQuery} from '../../api/models/input/input-query.dto';
import {PairGamesEntity} from "../../domain/pair-games.entity";
import {PlayersEntity} from "../../domain/players.entity";

@Injectable()
export class PairGameQueryRepositoryTypeOrm {
    constructor(
        @InjectRepository(PairGamesEntity)
        protected repository: Repository<PairGamesEntity>,
        @InjectDataSource() protected dataSource: DataSource,
        @InjectRepository(PlayersEntity)
        protected repositoryPlayer: Repository<PlayersEntity>,
    ) {
    }
    private get shareBuilder() {
        return this.repository
            .createQueryBuilder('pg')
            .select(['pg'])
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.user', 'firstUser')
            .leftJoinAndSelect('firstUser.accountData', 'firstAccountData')
            .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.user', 'secondUser')
            .leftJoinAndSelect('secondUser.accountData', 'secondAccountData')
            .leftJoinAndSelect(
                'firstPlayer.answers',
                'firstPlayerAnswers',
                'pg.id = firstPlayerAnswers.gameId',
            )
            .leftJoinAndSelect(
                'secondPlayer.answers',
                'secondPlayerAnswers',
                'pg.id = secondPlayerAnswers.gameId',
            )
            .leftJoinAndSelect('pg.questions', 'questions')
            .leftJoinAndSelect('questions.question', 'question')
            .orderBy('questions.index', 'ASC');
    }

    async getById(id: string): Promise<PairGamesEntity | null> {
        return this.shareBuilder
            .where('pg."id" = :id', {id})
            .getOne();
    }

    async getByUserId(userId: string): Promise<PairGamesEntity | null> {
        return this.shareBuilder
            .where('pg.finishGameDate IS NULL')
            .andWhere('firstUser.id = :userId')
            .orWhere('pg.finishGameDate IS NULL')
            .andWhere('secondUser.id = :userId')
            .setParameters({userId})
            .orderBy('questions.index', 'ASC')
            .getOne();
    }

    async getPaging(userId: string, query: pairGameQuery): Promise<PairGamesEntity[]> {
        const idsSubQuery = this.repository
            .createQueryBuilder('pg')
            .select('pg.id')
            .leftJoin('pg.firstPlayer', 'firstPlayer')
            .leftJoin('firstPlayer.user', 'firstUser')
            .leftJoin('pg.secondPlayer', 'secondPlayer')
            .leftJoin('secondPlayer.user', 'secondUser')
            .where('firstUser.id = :userId')
            .orWhere('secondUser.id = :userId')
            .setParameters({userId})
            .skip((query.pageNumber - 1) * query.pageSize)
            .take(query.pageSize);

        return this.repository
            .createQueryBuilder('pg')
            .where(`pg.id IN (${idsSubQuery.getQuery()})`)
            .setParameters(idsSubQuery.getParameters())
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.user', 'firstUser')
            .leftJoinAndSelect('firstUser.accountData', 'firstAccountData')
            .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.user', 'secondUser')
            .leftJoinAndSelect('secondUser.accountData', 'secondAccountData')
            .leftJoinAndSelect(
                'firstPlayer.answers',
                'firstPlayerAnswers',
                'pg.id = firstPlayerAnswers.gameId',
            )
            .leftJoinAndSelect(
                'secondPlayer.answers',
                'secondPlayerAnswers',
                'pg.id = secondPlayerAnswers.gameId',
            )
            .leftJoinAndSelect('pg.questions', 'questions')
            .leftJoinAndSelect('questions.question', 'question')
            .orderBy(`pg."${query.sortBy}"`, query.sortDirection)
            .addOrderBy('pg."pairCreatedDate"', 'DESC')
            .addOrderBy('"firstPlayerAnswers"."addedAt"', 'ASC')
            .addOrderBy('"secondPlayerAnswers"."addedAt"', 'ASC')
            .addOrderBy('questions.index', 'ASC')
            .getMany();
    }

    async getGamesByUserId(userId: string): Promise<number> {
        return this.repository
            .createQueryBuilder('pg')
            .select('pg.id')
            .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
            .leftJoinAndSelect('firstPlayer.user', 'firstUser')
            .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
            .leftJoinAndSelect('secondPlayer.user', 'secondUser')
            .where('firstUser.id = :userId')
            .orWhere('secondUser.id = :userId')
            .setParameters({userId})
            .getCount();
    }

    async getStatisticByUserId(userId: string) {
        try {
            const res = await this.repository
                .createQueryBuilder('pg')
                .leftJoinAndSelect('pg.firstPlayer', 'firstPlayer')
                .leftJoinAndSelect('firstPlayer.user', 'firstUser')
                .leftJoinAndSelect('pg.secondPlayer', 'secondPlayer')
                .leftJoinAndSelect('secondPlayer.user', 'secondUser')
                .select([
                    'pg.status',
                    'firstPlayer.playerScore',
                    'secondPlayer.playerScore',
                    'firstUser.id',
                    'secondUser.id',
                ])
                .where('firstUser.id = :userId')
                .orWhere('secondUser.id = :userId')
                .setParameters({userId})
                .getMany();

            return res;
        } catch (e) {
            console.log('ERROR in newGetStatisticByUserId', e)
        }
    }

    async getTopUsersOfGame(query: GameQueryTopUsers) {
        //const sort = query.sort;
        console.log('QUERY =', query)

        const players = this.repositoryPlayer
            .createQueryBuilder('player')
            .leftJoinAndSelect('player.user', 'u')
            .leftJoinAndSelect('u.accountData', 'data')
            .select([
                'u.id',
                'data.login',
                'player.playerScore',
                'player.gamesCount',
                'player.avgScores',
                'player.winsCount',
                'player.lossesCount',
                'player.drawsCount',
            ])

        if (typeof query.sort === 'string') {
            const sortArr = query.sort.split(' ');
            const sortBy = sortArr[0] === 'sumScore' ? 'playerScore' : sortArr[0];
            const sortAs = sortArr[1] === "DESC" ? "DESC" : "ASC";

            players.orderBy(`player."${sortBy}"`, sortAs)
        }
        else {
            let n = 0;

            query.sort.forEach( e => {
                const sortArr = e.split(' ')
                const sortBy = sortArr[0] === 'sumScore' ? 'playerScore' : sortArr[0];
                const sortAs = sortArr[1] === "DESC" ? "DESC" : "ASC";

                if (n === 0) players.orderBy(`player."${sortBy}"`, sortAs)
                else players.addOrderBy(`player."${sortBy}"`, sortAs)
                n++
            })
        }

        return players
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            // .take(query.pageSize)
            .getManyAndCount();
    }
}
