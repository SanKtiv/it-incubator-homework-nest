import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "./users.table";

@Entity('users-statistic')
export class UsersStatisticEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UsersTable)
    user: UsersTable;

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