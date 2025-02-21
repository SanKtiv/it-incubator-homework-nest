import { Injectable } from '@nestjs/common';
import { DevicesRepositoryTypeOrm } from './postgresqldb/devices-repository-type-orm.service';
import { DeviceDto } from '../api/models/device.dto';
import { DeviceTable } from '../domain/device.table';

@Injectable()
export class DevicesRepository {
  constructor(protected devicesRepository: DevicesRepositoryTypeOrm) {}

  async create(dto: DeviceDto): Promise<DeviceTable> {
    return this.devicesRepository.create(dto);
  }

  async save(device: DeviceTable): Promise<void> {
    await this.devicesRepository.save(device);
  }

  async findById(id: string): Promise<DeviceTable | null> {
    return this.devicesRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<DeviceTable[]> {
    return this.devicesRepository.findByUserId(userId);
  }

  async deleteById(id: string): Promise<DeviceTable | void> {
    return this.devicesRepository.deleteDeviceById(id);
  }

  async deleteManyByUserId(
    userId: string,
    deviceId: string,
  ): Promise<DeviceTable[] | void> {
    return this.devicesRepository.deleteDevices(userId, deviceId);
  }

  async deleteAll(): Promise<void> {
    await this.devicesRepository.deleteAll();
  }
}
