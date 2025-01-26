import { Injectable } from '@nestjs/common';
import { DeviceDto } from '../../api/models/device.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Not } from 'typeorm';
import { DeviceTable } from '../../domain/device.table';

@Injectable()
export class DevicesRepositoryORM {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DeviceTable);
  }

  async create(dto: DeviceDto): Promise<DeviceTable> {
    return this.repository.save(dto);
  }

  async save(device: DeviceTable): Promise<void> {
    await this.repository.save(device);
  }

  async findById(id: string): Promise<DeviceTable | null> {
    return this.repository.findOneBy({ id: id });
  }

  async findByUserId(userId: string): Promise<DeviceTable[]> {
    return this.repository.findBy({ userId: userId });
  }

  async deleteDeviceById(id: string) {
    const device = await this.findById(id);
    if (!device) return;
    return this.repository.remove(device);
  }

  async deleteDevices(userId: string, deviceId: string) {
    const devices = await this.repository.findBy({
      userId: userId,
      id: Not(deviceId),
    });
    if (!devices) return;
    return this.repository.remove(devices);
  }

  async removeAll(): Promise<void> {
    await this.repository.clear();
  }
}
