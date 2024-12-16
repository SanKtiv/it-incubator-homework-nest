import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToOne(() => UsersTable, (user) => user.accountData, {
    onDelete: 'CASCADE',
  })
  user: UsersTable;
}
