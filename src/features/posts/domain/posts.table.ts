import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('posts')
export class PostsTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('character varying')
    title: string;

    @Column('character varying')
    shortDescription: string;

    @Column('character varying')
    content: string;

    @Column('character varying')
    blogId: string;

    @Column('character varying')
    blogName: string;

    @Column('timestamp with time zone')
    createdAt: Date;
}