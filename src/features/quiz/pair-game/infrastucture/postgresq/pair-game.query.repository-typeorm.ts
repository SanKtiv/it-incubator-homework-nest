import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {GameQueryTopUsers, pairGameQuery} from '../../api/models/input/input-query.dto';
import {PairGamesEntity} from "../../domain/pair-games.entity";

@Injectable()
export class PairGameQueryRepositoryTypeOrm {
    constructor(
        @InjectRepository(PairGamesEntity)
        protected repository: Repository<PairGamesEntity>,
    ) { }
    async getById(id: string): Promise<PairGamesEntity | null> {
        return this.repository.findOne({
            where: {
                id: id,
            },
            order: {
                questions: {
                    index: 'ASC'
                },
                players: {
                    index: 'ASC'
                }
            }
        })
    }

    async getByUserId(userId: string): Promise<PairGamesEntity | null | undefined> {
        const subQueryGamesWithUserByUserId =
            this.repository
                .createQueryBuilder('g')
                .select('g.id')
                .leftJoin('g.players', 'p')
                .leftJoin('p.user', 'u')
                .where('game.finishGameDate IS NULL')
                .andWhere('u.id = :userId')

        return this.repository
            .createQueryBuilder('game')
            .where(`game.id IN (${subQueryGamesWithUserByUserId.getQuery()})`)
            .setParameters({userId})
            .leftJoinAndSelect('game.players', 'players')
            .leftJoinAndSelect('players.user', 'user')
            .leftJoinAndSelect('user.accountData', 'account')
            .leftJoinAndSelect('players.answers', 'answers')
            .leftJoinAndSelect('game.questions', 'questions')
            .leftJoinAndSelect('questions.question', 'question')
            .orderBy('players.index', 'ASC')
            .addOrderBy('questions.index', 'ASC')
            .getOne();
    }

    async getPaging(userId: string, query: pairGameQuery): Promise<PairGamesEntity[]> {

        const idsSubQuery = this.repository
            .createQueryBuilder('g')
            .select('g.id')
            .leftJoin('g.players', 'p')
            .leftJoin('p.user', 'u')
            .where('u.id = :userId')
            .skip((query.pageNumber - 1) * query.pageSize)
            .take(query.pageSize);

        return this.repository
            .createQueryBuilder('game')
            .where(`game.id IN (${idsSubQuery.getQuery()})`)
            .setParameters({userId})
            .leftJoinAndSelect('game.players', 'players')
            .leftJoinAndSelect('players.user', 'user')
            .leftJoinAndSelect('user.accountData', 'account')
            .leftJoinAndSelect('players.answers', 'answers', 'game.id = answers.gameId')
            .leftJoinAndSelect('game.questions', 'questions')
            .leftJoinAndSelect('questions.question', 'question')
            .orderBy(`game."${query.sortBy}"`, query.sortDirection)
            .addOrderBy('players.index', 'ASC')
            .addOrderBy('game."pairCreatedDate"', 'DESC')
            .addOrderBy('"answers"."addedAt"', 'ASC')
            .addOrderBy('questions.index', 'ASC')
            .getMany();
    }

    async getGamesByUserId(userId: string): Promise<number> {
        return this.repository
            .createQueryBuilder('game')
            .select('game.id')
            .leftJoinAndSelect('game.players', 'players')
            .leftJoinAndSelect('players.user', 'user')
            .where('user.id = :userId')
            .setParameters({userId})
            .getCount();
    }

    async getStatisticByUserId(userId: string) {
        return this.repository
                .createQueryBuilder('game')
                .leftJoinAndSelect('game.players', 'players')
                .leftJoinAndSelect('players.user', 'user')
                .select([
                    'game.status',
                    'players.score',
                    'players.win',
                    'players.lose',
                    'players.draw',
                    'user.id',
                ])
                .where('user.id = :userId')
                .setParameters({userId})
                .getMany();
    }

    async getTop(query: GameQueryTopUsers) {
        const topUsers = this.repository
            .createQueryBuilder('game')
            .leftJoin('game.players', 'players')
            .leftJoin('players.user', 'user')
            .leftJoin('user.accountData', 'account')
            .select('user.id', 'userId')
            .addSelect('account.login', 'login')
            .addSelect('SUM(players.score)', 'sumScore')
            .addSelect('ROUND(SUM(players.score)::numeric / COUNT(players.id), 2)', 'avgScores')
            .addSelect('COUNT(players.id)', 'gamesCount')
            .addSelect('SUM(players.win)', 'winsCount')
            .addSelect('SUM(players.lose)', 'lossesCount')
            .addSelect('SUM(players.draw)', 'drawsCount')
            .groupBy('user.id')
            .addGroupBy('account.login')

        let sortBy, sortAs = '';

        if (typeof query.sort === 'string') {
            [sortBy, sortAs] = query.sort.split(' ');

            topUsers.orderBy(`"${sortBy}"`, sortAs as 'ASC' | 'DESC')
        }
        else {
            let n = 0;

            query.sort.forEach(e => {
                [sortBy, sortAs] = e.split(' ');

                if (n === 0) topUsers.orderBy(`"${sortBy}"`, sortAs as 'ASC' | 'DESC');

                if (n !== 0) topUsers.addOrderBy(`"${sortBy}"`, sortAs as 'ASC' | 'DESC');

                n++;
            })
        }

        return topUsers
            .offset((query.pageNumber - 1) * query.pageSize)
            //.skip((query.pageNumber - 1) * query.pageSize)
            //.take(query.pageSize)
            .limit(query.pageSize)
            .getRawMany();
    }
}
