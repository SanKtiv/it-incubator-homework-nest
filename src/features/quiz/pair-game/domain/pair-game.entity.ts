import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";

@Entity('quiz-pair-game')
export class QuizPairGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersTable)
    @JoinColumn({ name: 'firstPlayerId' })
    firstPlayerId: string;

    @ManyToOne(() => UsersTable)
    @JoinColumn({ name: 'secondPlayerId' })
    secondPlayerId: string;

    @Column({ type: 'character varying', nullable: true })
    status: 'PendingSecondPlayer' | 'Active';

    @Column('timestamp with time zone')
    pairCreatedDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    startGameDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    finishGameDate: Date;
}