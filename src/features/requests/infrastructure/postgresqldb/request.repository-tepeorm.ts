import { Injectable } from '@nestjs/common';
import { RequestApiInputDto } from '../../api/models/input.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { RequestTable } from '../../domain/request.table';

@Injectable()
export class RequestApiRepositoryTypeOrm {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(RequestTable)
  }

  async create(dto: RequestTable) {
    await this.repository.save(dto);
  }

  async findByIp(dto: RequestApiInputDto, date: Date) {
    return this.repository.countBy({
      ip: dto.ip,
      url: dto.url,
      date: MoreThanOrEqual(date),
    });
  }

  async removeAll() {
    await this.repository.clear();
  }

  async deleteAll_RAW() {
    await this.dataSource.query(`TRUNCATE "requests" CASCADE`);
  }
}
