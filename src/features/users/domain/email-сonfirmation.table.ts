import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "./users.table";

@Entity('emailConfirmation')
export class EmailConfirmationTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UsersTable, user => user.emailConfirmation)
    @JoinColumn()
    user: UsersTable;

    @Column('character varying')
    confirmationCode: string;

    @Column('date')
    expirationDate: Date;

    @Column({type: 'boolean', default: false})
    isConfirmed: boolean;
}