import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UsersTable} from '../../../users/domain/users.table';
import {PlayerAnswersEntity} from './player-answers.entity';

@Entity('pair-game-players')
export class PairGamePlayersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersTable, (user) => user.pairGamePlayer)
    @JoinColumn()
    user: UsersTable;

    @OneToMany(() => PlayerAnswersEntity, (answer) => answer.player, {
        nullable: true,
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    answers: PlayerAnswersEntity[] | null;

    @Column({type: 'smallint', default: 0})
    playerScore: number;

    @Column({type: 'smallint', default: 0})
    gamesCount: number;

    @Column({
        type: 'double precision',
        generatedType: 'STORED',
        asExpression: `CASE WHEN "gamesCount" > 0 THEN "playerScore"::double precision / "gamesCount" ELSE 0 END`
    })
    avgScores: number;

    @Column({type: 'smallint', default: 0})
    winsCount: number;

    @Column({type: 'smallint', default: 0})
    lossesCount: number;

    @Column({type: 'smallint', default: 0})
    drawsCount: number;
}
