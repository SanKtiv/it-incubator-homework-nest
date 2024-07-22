import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlogsTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    websiteUrl: string;

    @Column()
    createdAt: string;

    @Column({default: true})
    isMembership: boolean;
}