import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PostsTable} from "../../posts/domain/posts.table";

@Entity('statuses')
export class StatusesTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'uuid', default: null })
  postId: string | null;

  @Column({ type: 'uuid', default: null })
  commentId: string | null;

  @Column('character varying')
  userStatus: string;

  @Column('timestamp with time zone')
  addedAt: Date;
}

@Entity('statuses_comments')
export class StatusesCommentsTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  commentId: string;

  @Column({ type: 'character varying', default: 'None' })
  userStatus: string;

  @Column('timestamp with time zone')
  addedAt: Date;
}

@Entity('statuses_posts')
export class StatusesPostsTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(
      () => PostsTable,
      (PostsTable) => PostsTable.statuses
  )
  @JoinColumn({ name: 'postId' })
  postId: string;

  @Column({ type: 'character varying', default: 'None' })
  userStatus: string;

  @Column('timestamp with time zone')
  addedAt: Date;
}
