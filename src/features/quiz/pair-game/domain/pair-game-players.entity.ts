import {Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";
import {PlayerAnswersEntity} from "./new-player-answers.entity";

@Entity('pair-game-players')
export class PairGamePlayersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => UsersTable,
            user => user.pairGamePlayer
    )
    @JoinColumn()
    user: UsersTable;

    @OneToMany(
        () => PlayerAnswersEntity,
        answer => answer.player)
    @JoinColumn()
    answers: PlayerAnswersEntity[];
}