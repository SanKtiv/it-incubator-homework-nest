import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {QuizQuestionsEntity} from "../../questions/domain/quiz-questions.entity";
import {QuizPairGameStatusType} from "./pair-game.entity";

@Entity('new-pair-game')
export class NewPairGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    firstPlayer;

    secondPlayer;

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