import {
  Column,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {QuizPairGameEntity} from "../../pair-game/domain/pair-game.entity";

@Entity('quiz-questions')
export class QuizQuestionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  body: string;

  // @Column('simple-array')
  // correctAnswers: string[];

  @Column('character varying')
  correctAnswers: string;

  @Column({ default: false })
  published: boolean;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}
