import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {PlayersEntity} from "./players.entity";

@Entity('player-answers')
export class PlayerAnswersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    gameId: string;

    @Column({type: 'uuid'})
    questionId: string;

    @Column({type: 'character varying'})
    answerStatus: 'Correct' | 'Incorrect';

    @Column('timestamp with time zone')
    addedAt: Date;

    @ManyToOne(
        () => PlayersEntity,
        (player) => player.answers
    )
    @JoinColumn()
    player: PlayersEntity;
}
