import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizPairGameEntity } from './pair-game.entity';
import {NewQuizQuestionsEntity, QuizQuestionsEntity} from '../../questions/domain/quiz-questions.entity';
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
