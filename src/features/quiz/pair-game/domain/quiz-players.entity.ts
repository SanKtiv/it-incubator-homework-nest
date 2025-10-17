import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UsersTable} from '../../../users/domain/users.table';
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
        (player) => player.quizPlayer,
        {
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn()
    players: PlayersEntity;

    @OneToMany(() => PlayerAnswersEntity,
        (answer) => answer.player,
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
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    gameScore: GamePlayerScoresEntity[];

    @OneToOne(
        () => UsersStatisticEntity,
        (statistic) => statistic.player,
        {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    })
    @JoinColumn()
    statistic: UsersStatisticEntity;
}
