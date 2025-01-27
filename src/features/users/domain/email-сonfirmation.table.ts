import {Column, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { UsersTable } from './users.table';

@Entity('emailConfirmation')
export class EmailConfirmationTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersTable, (user) => user.emailConfirmation, {
    //cascade: true,
    onDelete: 'CASCADE',
  })
  user: UsersTable;

  @Column('character varying')
  confirmationCode: string;

  @Column('timestamp with time zone')
  expirationDate: Date;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}

