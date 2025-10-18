import {
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {PlayerAnswersEntity} from './player-answers.entity';
import {UsersStatisticEntity} from "../../../users/domain/statistic.table";
import {GamePlayerScoresEntity} from "./game-player-scores";
import {PlayersEntity} from "./players.entity";

@Entity('quiz-players')
export class QuizPlayersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => PlayersEntity,
        // (player) => player.quizPlayer,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn()
    players: PlayersEntity;

    @OneToMany(() => PlayerAnswersEntity,
        (answer) => answer.quizPlayer,
        {
            nullable: true,
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        })
    answers: PlayerAnswersEntity[] | null;

    @OneToMany(
        () => GamePlayerScoresEntity,
        (score) => score.playerScore,
        {
            nullable: true,
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        }
    )
    gameScore: GamePlayerScoresEntity[] | null;

    @OneToOne(
        () => UsersStatisticEntity,
        //(statistic) => statistic.quizPlayer,
        {
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn()
    statistic: UsersStatisticEntity;
}
