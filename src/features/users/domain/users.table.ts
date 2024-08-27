import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account_data')
export class AccountData {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @PrimaryColumn()
  login: string;

  @Column()
  email: string;

  @Column()
  createdAt: string;

  @Column()
  passwordHash: string;
}

@Entity('users')
// @Tree("closure-table")
export class UsersTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  login: string;

  @Column('text')
  email: string;

  @Column('text')
  createdAt: string;

  @Column('text')
  passwordHash: string;

  @Column('text')
  confirmationCode: string;

  @Column('date')
  expirationDate: Date;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ type: 'text', nullable: true })
  recoveryCode: string;

  @Column({ type: 'date', nullable: true })
  expirationDateRecovery: Date;

  // @OneToOne(() => AccountData)
  // @JoinColumn()
  // @TreeParent()
  // accountData: AccountData;
}
