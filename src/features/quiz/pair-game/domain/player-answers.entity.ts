import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlayersEntity } from './players.entity';

@Entity('player-answers')
export class PlayerAnswersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  gameId: string;

  @ManyToOne(
      () => PlayersEntity,
      (player) => player.answers
  )
  @JoinColumn()
  player: PlayersEntity;

  @Column({ type: 'uuid' })
  questionId: string;

  @Column({ type: 'character varying' })
  answerStatus: 'Correct' | 'Incorrect';

  @Column('timestamp with time zone')
  addedAt: Date;
}
