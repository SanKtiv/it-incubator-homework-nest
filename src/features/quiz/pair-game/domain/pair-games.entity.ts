import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {QuestionsGameEntity} from './questions-game.entity';
import {PlayersEntity} from "./players.entity";

@Entity('pair-game')
export class PairGamesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(
        () => PlayersEntity,
        (player) => player.game,
        {
            cascade: ['insert', 'update'],
            eager: true,
        }
    )
    @JoinColumn()
    players: PlayersEntity[];

    // @OneToOne(
    //     () => PlayersEntity,
    //     (player) => player.firstGame,
    //     {
    //         cascade: ['insert', 'update'],
    //         eager: true,
    //     }
    // )
    // @JoinColumn()
    // firstPlayer: PlayersEntity;
    //
    // @OneToOne(
    //     () => PlayersEntity,
    //     (player) => player.secondGame,
    //     {
    //         nullable: true,
    //         cascade: ['insert', 'update'],
    //         eager: true,
    //     }
    // )
    // @JoinColumn()
    // secondPlayer: PlayersEntity | null;

    @OneToMany(
        () => QuestionsGameEntity,
        (questions) => questions.game,
        {
        nullable: true,
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    questions: QuestionsGameEntity[] | null;

    @Column({type: 'character varying'})
    status: QuizPairGameStatusType;

    @Column('timestamp with time zone')
    pairCreatedDate: Date;

    @Column({type: 'timestamp with time zone', nullable: true})
    startGameDate: Date | null;

    @Column({type: 'timestamp with time zone', nullable: true})
    finishGameDate: Date | null;
}

export type QuizPairGameStatusType =
    | 'PendingSecondPlayer'
    | 'Active'
    | 'Finished';
