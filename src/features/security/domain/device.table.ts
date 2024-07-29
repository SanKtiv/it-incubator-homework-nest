import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('devices')
export class DeviceTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    ip: string;

    @Column('text')
    title: string;

    @Column('text')
    userId: string;

    @Column({type: 'text', nullable: true})
    lastActiveDate: string;

    @Column({type: 'text', nullable: true})
    expirationDate: string;
}