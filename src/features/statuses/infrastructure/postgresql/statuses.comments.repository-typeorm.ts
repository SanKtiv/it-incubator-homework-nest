import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusesCommentsTable } from '../../domain/statuses.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusesCommentsRepositoryTypeOrm {
  constructor(
    @InjectRepository(StatusesCommentsTable)
    protected repository: Repository<StatusesCommentsTable>,
  ) {}

  async insert(postStatusEntity: StatusesCommentsTable) {
    await this.repository.save(postStatusEntity);
  }

  async getStatusByCommentIdAndUserId(
    id: string,
    userId: string,
  ): Promise<StatusesCommentsTable | null> {
    return this.repository.findOneBy({ userId: userId, commentId: id });
  }

  async clear() {
    await this.repository.query('TRUNCATE TABLE "statuses_comments" CASCADE');
  }
}
