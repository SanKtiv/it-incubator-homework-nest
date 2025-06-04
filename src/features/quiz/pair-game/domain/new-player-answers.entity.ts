import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PairGamePlayersEntity} from "./pair-game-players.entity";

@Entity('new-answers')
export class PlayerAnswersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => PairGamePlayersEntity,
        player => player.answers
    )
    @JoinColumn()
    player: PairGamePlayersEntity;

    @Column({ type: 'uuid' })
    questionId: string;

    @Column({ type: 'character varying' })
    answerStatus: 'Correct' | 'Incorrect';

    @Column('timestamp with time zone')
    addedAt: Date;
}