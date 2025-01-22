import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async deleteAll_RAW() {
    await this.dataSource.query(`TRUNCATE "devices" CASCADE`);
  }
}
