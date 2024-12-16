import { Injectable } from '@nestjs/common';
import { RequestApiInputDto } from '../../api/models/input.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { RequestTable } from '../../domain/request.table';

@Injectable()
export class RequestApiSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(dto: RequestTable) {
    await this.dataSource.getRepository(RequestTable).save(dto);
  }

  async findByIp(dto: RequestApiInputDto, date: Date) {
    return this.dataSource.getRepository(RequestTable).findBy({
      ip: dto.ip,
      url: dto.url,
      date: MoreThanOrEqual(date),
    });
  }

  async removeAll() {
    await this.dataSource.getRepository(RequestTable).clear();
  }

  async deleteAll_RAW() {
    await this.dataSource.query(`TRUNCATE "requests" CASCADE`);
  }
}
