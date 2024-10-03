import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('comments')
export class CommentsTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('character varying')
    content: string;

    @Column('character varying')
    userId: string;

    @Column('character varying')
    userLogin: string;

    @Column('timestamp with time zone')
    createdAt: Date;

    @Column('character varying')
    postId: string;

    @Column({type:'int', default: 0})
    likesCount: number;

    @Column({type:'int', default: 0})
    dislikesCount: number;
}