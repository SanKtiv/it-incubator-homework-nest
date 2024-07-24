import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Tree,
  TreeParent,
} from 'typeorm';

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

  @OneToOne(() => AccountData)
  @JoinColumn()
  // @TreeParent()
  accountData: AccountData;
}
