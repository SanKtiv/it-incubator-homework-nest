import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {NewQuizQuestionsEntity} from '../../questions/domain/quiz-questions.entity';
import { NewPairGameEntity } from './new-pair-game.entity';

@Entity('new-questions-game')
export class QuestionsGameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  index: number;

  @ManyToOne(() => NewPairGameEntity, (game) => game.questions)
  @JoinColumn()
  game: NewPairGameEntity;

  @ManyToOne(() => NewQuizQuestionsEntity )
  @JoinColumn()
  questions: NewQuizQuestionsEntity;

  // @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  // deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}
