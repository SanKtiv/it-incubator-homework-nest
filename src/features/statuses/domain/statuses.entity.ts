import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
