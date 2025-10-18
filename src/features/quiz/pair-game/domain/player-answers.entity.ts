import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizPlayersEntity } from './quiz-players.entity';

@Entity('player-answers')
export class PlayerAnswersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  gameId: string;

  @ManyToOne(
      () => QuizPlayersEntity,
      (player) => player.answers
  )
  @JoinColumn()
  quizPlayer: QuizPlayersEntity;

  @Column({ type: 'uuid' })
  questionId: string;

  @Column({ type: 'character varying' })
  answerStatus: 'Correct' | 'Incorrect';

  @Column('timestamp with time zone')
  addedAt: Date;
}
