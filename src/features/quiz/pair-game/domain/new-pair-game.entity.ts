import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {QuizPairGameStatusType} from "./pair-game.entity";
import {PairGamePlayersEntity} from "./pair-game-players.entity";
import {QuestionsGameEntity} from "./new-questions-game.entity";

@Entity('new-pair-game')
export class NewPairGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => PairGamePlayersEntity,
        {
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        })
    @JoinColumn()
    firstPlayer: PairGamePlayersEntity;

    @OneToOne(
        () => PairGamePlayersEntity,
        {
            nullable: true,
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        })
    @JoinColumn()
    secondPlayer: PairGamePlayersEntity | null;

    @OneToMany(
        () => QuestionsGameEntity,
        questions => questions.game,
        {
            nullable: true,
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        })
    @JoinColumn()
    questions: QuestionsGameEntity[] | null;

    @Column({ type: 'character varying' })
    status: QuizPairGameStatusType;

    @Column('timestamp with time zone')
    pairCreatedDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    startGameDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    finishGameDate: Date;
}