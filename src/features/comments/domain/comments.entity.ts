import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsTable } from '../../posts/domain/posts.table';
import { UsersTable } from '../../users/domain/users.table';

@Entity('comments')
export class CommentsTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  content: string;

  @Column('timestamp with time zone')
  createdAt: Date;

  @ManyToOne(() => UsersTable)
  @JoinColumn({ name: 'userId' })
  userId: string;

  @ManyToOne(() => PostsTable)
  @JoinColumn({ name: 'postId' })
  postId: string;
}
