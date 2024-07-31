import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('requests')
export class RequestTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    ip: string;
    @Column('text')
    url: string;
    @Column('date')
    date: Date;
}