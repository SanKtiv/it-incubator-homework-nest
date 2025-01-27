import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesRepositoryRawsql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async deleteAll() {
    await this.dataSource.query(`TRUNCATE "devices" CASCADE`);
  }
}
