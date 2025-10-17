import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {QuizPlayersEntity} from './quiz-players.entity';
import {QuestionsGameEntity} from './questions-game.entity';

@Entity('pair-game')
export class PairGamesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => QuizPlayersEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn()
    firstPlayer: QuizPlayersEntity;

    @OneToOne(
        () => QuizPlayersEntity,
        {
            nullable: true,
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn()
    secondPlayer: QuizPlayersEntity | null;

    @OneToMany(
        () => QuestionsGameEntity,
        (questions) => questions.game,
        {
        nullable: true,
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    questions: QuestionsGameEntity[] | null;

    @Column({type: 'character varying'})
    status: QuizPairGameStatusType;

    @Column('timestamp with time zone')
    pairCreatedDate: Date;

    @Column({type: 'timestamp with time zone', nullable: true})
    startGameDate: Date;

    @Column({type: 'timestamp with time zone', nullable: true})
    finishGameDate: Date;
}

export type QuizPairGameStatusType =
    | 'PendingSecondPlayer'
    | 'Active'
    | 'Finished';
