import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersTable } from '../../../users/domain/users.table';
import { QuizQuestionsEntity } from '../../questions/domain/quiz-questions.entity';
import { AnswersGameEntity } from './answers-game.entity';

@Entity('quiz-pair-game')
export class QuizPairGameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersTable, { nullable: true })
  @JoinColumn({ name: 'firstPlayer' })
  firstPlayer: UsersTable;

  @OneToMany(() => AnswersGameEntity, (answer) => answer.pairGameFirstPlayer, {
    //nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answersFirstPlayer' })
  answersFirstPlayer: AnswersGameEntity[];

  @Column({ type: 'smallint', default: 0 })
  firstPlayerScore: number;

  @ManyToOne(() => UsersTable, { nullable: true })
  @JoinColumn({ name: 'secondPlayer' })
  secondPlayer: UsersTable;

  @Column({ type: 'smallint', default: 0 })
  secondPlayerScore: number;

  @OneToMany(() => AnswersGameEntity, (answer) => answer.pairGameSecondPlayer, {
    //nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answersSecondPlayer' })
  answersSecondPlayer: AnswersGameEntity[];

  @OneToMany(() => QuizQuestionsEntity,
      (questions) => questions.quizGameId
  , { nullable: true })
  @JoinColumn({ name: 'questions' })
  questions: QuizQuestionsEntity[];

  @Column({ type: 'character varying' })
  status: QuizPairGameStatusType;

  @Column('timestamp with time zone')
  pairCreatedDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startGameDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  finishGameDate: Date;
}

export type QuizPairGameStatusType = 'PendingSecondPlayer' | 'Active';
