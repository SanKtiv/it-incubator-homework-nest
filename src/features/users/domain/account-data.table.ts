import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "./users.table";

@Entity('accountData')
export class AccountDataTable {
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

    @OneToOne(() => UsersTable, user => user.accountData)
    @JoinColumn()
    user: UsersTable;
}