import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersTable } from './users.table';

@Entity('passwordRecovery')
export class PasswordRecoveryTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersTable, (user) => user.passwordRecovery, {
    //cascade: true,
    onDelete: 'CASCADE',
  })
  user: UsersTable;

  @Column({ type: 'character varying', nullable: true })
  recoveryCode: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDateRecovery: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}
