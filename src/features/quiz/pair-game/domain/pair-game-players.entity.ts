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
export class PairGamePlayersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
    // @ManyToOne(
        () => UsersTable,
        // (user) => user.pairGamePlayer,
        {
            cascade: false,
            eager: false
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
