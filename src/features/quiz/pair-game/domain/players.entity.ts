import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";
import {PlayerAnswersEntity} from "./player-answers.entity";

@Entity('players')
export class PlayersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    gameId: string;

    @Column({type: 'smallint', default: 0})
    score: number;

    @Column({type: 'smallint', default: 0})
    win: number;

    @Column({type: 'smallint', default: 0})
    lose: number;

    @Column({type: 'smallint', default: 0})
    draw: number;

    @ManyToOne(
        () => UsersTable,
        (user) => user.players,
        {
            cascade: ['insert', 'update'],
            eager: true,
        }
    )
    @JoinColumn()
    user: UsersTable;

    @OneToMany(
        () => PlayerAnswersEntity,
        (answer) => answer.player,
        {
            nullable: true,
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        }
    )
    answers: PlayerAnswersEntity[] | null;
}
