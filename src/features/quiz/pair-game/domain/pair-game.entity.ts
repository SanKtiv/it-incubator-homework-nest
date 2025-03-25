import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";

@Entity()
export class QuizPairGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UsersTable)
    @JoinColumn()
    firstPlayer: UsersTable;

    @OneToOne(() => UsersTable)
    @JoinColumn()
    secondPlayer: UsersTable;

    @Column({ type: 'character varying', nullable: true })
    status: 'PendingSecondPlayer' | 'Active';

    @Column('timestamp with time zone')
    pairCreatedDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    startGameDate: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    finishGameDate: Date;
}