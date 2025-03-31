import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('answers')
export class AnswersGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    gameId: string;

    @Column({ type: 'uuid'})
    userId: string;

    @Column({ type: 'uuid'})
    questionId: string;

    @Column({ type: 'character varying' })
    answerStatus: 'Correct' | 'Incorrect';

    @Column('timestamp with time zone')
    addedAt: Date;
 }