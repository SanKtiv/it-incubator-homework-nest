import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {QuizQuestionsEntity} from "../../questions/domain/quiz-questions.entity";
import {QuizPairGameStatusType} from "./pair-game.entity";
import {PairGamePlayersEntity} from "./pair-game-players.entity";

@Entity('new-pair-game')
export class NewPairGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PairGamePlayersEntity)
    @JoinColumn()
    firstPlayer: PairGamePlayersEntity;

    @OneToOne(() => PairGamePlayersEntity, {nullable: true})
    @JoinColumn()
    secondPlayer: PairGamePlayersEntity | null;

    questions: QuizQuestionsEntity[];

    @Column({ type: 'character varying' })
    status: QuizPairGameStatusType;

    @Column('timestamp with time zone')
    pairCreatedDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    startGameDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    finishGameDate: Date;
}