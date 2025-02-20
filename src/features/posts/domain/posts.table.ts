import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogsTable } from '../../blogs/domain/blog.entity';

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

  @Column('timestamp with time zone')
  createdAt: Date;

  @ManyToOne(() => BlogsTable)
  @JoinColumn({ name: 'blogId' })
  blogId: string; //BlogsTable;
}
