import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersTable } from './users.table';

@Entity('accountData')
export class AccountDataTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying', nullable: false })
  login: string;

  @Column({ type: 'character varying', nullable: false })
  email: string;

  @Column({ type: 'timestamp with time zone', nullable: false })
  createdAt: Date;

  @Column({ type: 'character varying', nullable: false })
  passwordHash: string;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete

  @OneToOne(
      () => UsersTable,
      (user) => user.accountData,
      {
    //cascade: true,
    onDelete: 'CASCADE',
  })
  user: UsersTable;
}
