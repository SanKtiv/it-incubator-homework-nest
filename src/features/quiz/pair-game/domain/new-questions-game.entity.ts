import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {QuestionsEntity} from '../../questions/domain/quiz-questions.entity';
import { NewPairGameEntity } from './new-pair-game.entity';

@Entity('questions-game')
export class QuestionsGameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  index: number;

  @ManyToOne(() => NewPairGameEntity, (game) => game.questions)
  @JoinColumn()
  game: NewPairGameEntity;

  @ManyToOne(() => QuestionsEntity )
  @JoinColumn()
  question: QuestionsEntity;

  // @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  // deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}
