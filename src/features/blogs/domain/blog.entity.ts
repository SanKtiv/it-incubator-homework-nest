import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { name } from 'ts-jest/dist/transformers/hoist-jest';

@Entity('blogs')
export class BlogsTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  name: string;

  @Column('character varying')
  description: string;

  @Column('character varying')
  websiteUrl: string;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column({ default: true })
  isMembership: boolean;
}

@Entity('forBlogs')
export class ForBlogsTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column('character varying')
  name: string;
}
