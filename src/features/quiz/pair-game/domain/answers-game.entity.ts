import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {QuizPairGameEntity} from "./pair-game.entity";
import {UsersTable} from "../../../users/domain/users.table";

@Entity('answers')
export class AnswersGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => QuizPairGameEntity)
    @JoinColumn({
        name: 'pairGameId'
    })
    pairGameId: QuizPairGameEntity;

    @ManyToOne(() => UsersTable,
        user => user.id)
    @JoinColumn({ name: 'userId' })
    userId: string;

    @Column({ type: 'uuid'})
    questionId: string;

    @Column({ type: 'character varying' })
    answerStatus: 'Correct' | 'Incorrect';

    @Column('timestamp with time zone')
    addedAt: Date;
 }