import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('new_quiz-questions')
export class QuestionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  body: string;

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