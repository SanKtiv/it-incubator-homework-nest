import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

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

    @OneToOne(() => AccountData)
    @JoinColumn()
    accountData: AccountData;
}