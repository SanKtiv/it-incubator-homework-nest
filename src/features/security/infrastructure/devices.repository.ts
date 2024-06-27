import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
  DeviceModelType,
} from '../domain/device.schema';
import { DeviceDto } from '../api/models/device.dto';

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private DeviceModel: DeviceModelType) {}

  async create(dto: DeviceDto): Promise<DeviceDocument> {
    const document = await this.DeviceModel.createDevice(dto, this.DeviceModel);
    await document.save();
    return document;
  }

  async save(document: DeviceDocument): Promise<void> {
    await document.save();
  }

  async findById(id: string): Promise<DeviceDocument | null> {
    return this.DeviceModel.findById(id);
  }

  async findByUserId(userId: string): Promise<DeviceDocument[]> {
    return this.DeviceModel.find({ userId: userId });
  }

  async deleteDeviceById(id: string) {
    return this.DeviceModel.findByIdAndDelete(id);
  }

  async deleteDevices(userId: string, deviceId: string) {
    await this.DeviceModel.deleteMany({
      userId: userId,
      _id: { $ne: deviceId },
    });
  }

  async removeAll(): Promise<void> {
    await this.DeviceModel.deleteMany();
  }
}
