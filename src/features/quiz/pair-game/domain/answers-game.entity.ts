import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {QuizPairGameEntity} from "./pair-game.entity";
import {UsersTable} from "../../../users/domain/users.table";

@Entity('answers')
export class AnswersGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    pairGame: string;

    @ManyToOne(() => UsersTable,
        user => user.id,
        // {
        //     cascade: true,
        //     eager: true,
        //     onDelete: 'CASCADE',
        // }
        )
    @JoinColumn({ name: 'userId' })
    userId: string;

    @Column({ type: 'uuid'})
    questionId: string;

    @Column({ type: 'character varying' })
    answerStatus: 'Correct' | 'Incorrect';

    @Column('timestamp with time zone')
    addedAt: Date;
 }