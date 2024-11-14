import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "./users.table";

@Entity('passwordRecovery')
export class PasswordRecoveryTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UsersTable, user => user.passwordRecovery)
    @JoinColumn()
    user: UsersTable;

    @Column({type: 'character varying', nullable: true})
    recoveryCode: string;

    @Column({type: 'date', nullable: true})
    expirationDateRecovery: Date;
}