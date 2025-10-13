import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "./users.table";
import {PairGamePlayersEntity} from "../../quiz/pair-game/domain/pair-game-players.entity";

@Entity('users-statistic')
export class UsersStatisticEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @OneToOne(() => UsersTable, (user) => user.statistic, {
    //     cascade: true,
    //     eager: true,
    // })
    // user: UsersTable;

    @Column({type: 'smallint', default: 0})
    sumScore: number;

    @Column({type: 'smallint', default: 0})
    gamesCount: number;

    @Column({
        type: 'double precision',
        generatedType: 'STORED',
        asExpression: `CASE WHEN "gamesCount" > 0 THEN "sumScore"::double precision / "gamesCount" ELSE 0 END`
    })
    avgScores: number;

    @Column({type: 'smallint', default: 0})
    winsCount: number;

    @Column({type: 'smallint', default: 0})
    lossesCount: number;

    @Column({type: 'smallint', default: 0})
    drawsCount: number;
}