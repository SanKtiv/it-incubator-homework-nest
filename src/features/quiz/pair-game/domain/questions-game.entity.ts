import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {QuestionsEntity} from '../../questions/domain/quiz-questions.entity';
import { PairGamesEntity } from './pair-games.entity';

@Entity('questions-game')
export class QuestionsGameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  index: number;

  @ManyToOne(
      () => PairGamesEntity,
      (game) => game.questions
  )
  @JoinColumn()
  game: PairGamesEntity;

  @ManyToOne(
      () => QuestionsEntity,
      {
        eager: true,
      })
  @JoinColumn()
  question: QuestionsEntity;

  // @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  // deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}
