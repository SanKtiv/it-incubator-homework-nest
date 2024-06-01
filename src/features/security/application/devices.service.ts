import { Injectable } from '@nestjs/common';
import { DevicesRepository } from '../infrastructure/devices.repository';
import { DeviceDto } from '../api/models/device.dto';
import { DeviceDocument } from '../domain/device.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: DeviceDto): Promise<DeviceDocument> {
    return this.devicesRepository.create(dto);
  }

  async save(document: DeviceDocument, token: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(token);
    document.expirationDate = new Date(payload.exp * 1000).toISOString();
    document.lastActiveDate = new Date(payload.iat * 1000).toISOString();
    await this.devicesRepository.save(document);
  }

  async findById(deviceId: string) {}
}
