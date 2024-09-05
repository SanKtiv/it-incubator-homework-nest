import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('posts')
export class PostsTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('char varying')
    title: string;

    @Column('char varying')
    shortDescription: string;

    @Column('char varying')
    content: string;

    @Column('char varying')
    blogId: string;

    @Column('char varying')
    blogName: string;

    @Column('date')
    createdAt: Date;
}