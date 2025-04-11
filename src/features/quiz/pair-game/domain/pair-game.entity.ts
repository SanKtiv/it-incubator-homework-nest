import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";
import {QuizQuestionsEntity} from "../../questions/domain/quiz-questions.entity";
import {AnswersGameEntity} from "./answers-game.entity";

@Entity('quiz-pair-game')
export class QuizPairGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersTable,
        (UsersTable) => UsersTable.id,
        { nullable: true})
    @JoinColumn({ name: 'firstPlayerId' })
    firstPlayerId: string;

    @Column({type: 'smallint', default: 0})
    firstPlayerScore: number;

    @ManyToOne(() => UsersTable,
        (UsersTable) => UsersTable.id,
        { nullable: true})
    @JoinColumn({ name: 'secondPlayerId' })
    secondPlayerId: string;

    @Column({type: 'smallint', default: 0})
    secondPlayerScore: number;

    @OneToMany(() => QuizQuestionsEntity,
        questions => questions.quizGameId)
    @JoinColumn({ name: 'questions'})
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

export type QuizPairGameStatusType = 'PendingSecondPlayer' | 'Active';