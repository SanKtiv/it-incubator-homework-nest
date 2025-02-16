import { Injectable } from '@nestjs/common';
import { DeviceDto } from '../../api/models/device.dto';
import {InjectDataSource, InjectRepository} from '@nestjs/typeorm';
import {DataSource, Not, Repository} from 'typeorm';
import { DeviceTable } from '../../domain/device.table';

@Injectable()
export class DevicesRepositoryTypeOrm {
  constructor(@InjectDataSource() protected dataSource: DataSource,
              @InjectRepository(DeviceTable) protected repository: Repository<DeviceTable>) {}

  async create(dto: DeviceDto): Promise<DeviceTable> {
    return this.repository.save(dto);
  }

  async save(device: DeviceTable): Promise<void> {
    await this.repository.save(device);
  }

  async findById(id: string): Promise<DeviceTable | null> {
    return this.repository.findOneBy({ id });
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

  async deleteAll(): Promise<void> {
    await this.repository.clear();
  }
}
