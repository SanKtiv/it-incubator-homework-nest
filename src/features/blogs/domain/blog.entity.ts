import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blogs')
export class BlogsTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column('date')
  createdAt: Date;

  @Column({ default: true })
  isMembership: boolean;
}
