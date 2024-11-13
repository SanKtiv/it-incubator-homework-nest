import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

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
export class UsersTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  login: string;

  @Column('character varying')
  email: string;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column('character varying')
  passwordHash: string;

  // @Column('character varying')
  // confirmationCode: string;
  //
  // @Column('date')
  // expirationDate: Date;
  //
  // @Column({ type: 'boolean', default: false })
  // isConfirmed: boolean;
  //
  // @Column({ type: 'character varying', nullable: true })
  // recoveryCode: string;
  //
  // @Column({ type: 'date', nullable: true })
  // expirationDateRecovery: Date;

  // @OneToOne(() => AccountData)
  // @JoinColumn()
  // @TreeParent()
  // accountData: AccountData;
}

@Entity('usersConfirmInfo')
export class UsersConfirmInfoTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersTable)
  @JoinColumn()
  user: UsersTable;

  @Column('character varying')
  confirmationCode: string;

  @Column('date')
  expirationDate: Date;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;
}

@Entity('usersRecoveryInfo')
export class UsersRecoveryInfoTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersTable)
  @JoinColumn()
  user: UsersTable;

  @Column({ type: 'character varying', nullable: true })
  recoveryCode: string;

  @Column({ type: 'date', nullable: true })
  expirationDateRecovery: Date;
}
