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

@Entity('pair-game-players')
export class PlayersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => UsersTable,
        (user) => user.players,
        {
            cascade: true,
            eager: true
        }
    )
    @JoinColumn()
    user: UsersTable;

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
