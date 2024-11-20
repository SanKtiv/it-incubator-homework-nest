import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';


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
