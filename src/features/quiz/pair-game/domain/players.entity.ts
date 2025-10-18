import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";
import {QuizPlayersEntity} from "./quiz-players.entity";

@Entity('players')
export class PlayersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => UsersTable,
        (user) => user.players,
        {
            cascade: ['insert', 'update'],
            eager: true,
        }
    )
    @JoinColumn()
    user: UsersTable;

    // @OneToOne(
    //     () => QuizPlayersEntity,
    //     (quizPlayer) => quizPlayer.players,
    //     {
    //         cascade: false,
    //         eager: false,
    //     }
    // )
    // @JoinColumn()
    // quizPlayer: QuizPlayersEntity;
}
