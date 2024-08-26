import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DevicesRepository } from '../infrastructure/devices.repository';
import { DeviceDto } from '../api/models/device.dto';
import { DeviceDocument } from '../domain/device.schema';
import { JwtService } from '@nestjs/jwt';
import {
  devicesViewModel,
  OutputDeviceDto,
} from '../api/models/output-device.dto';
import {DevicesSqlRepository} from "../infrastructure/devices.sql.repository";
import {DeviceTable} from "../domain/device.table";

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly devicesSqlRepository: DevicesSqlRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: DeviceDto): Promise<DeviceTable> {
    return this.devicesSqlRepository.create(dto);
  }

  async save(device: DeviceTable, token: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(token);
    device.expirationDate = new Date(payload.exp * 1000).toISOString();
    device.lastActiveDate = new Date(payload.iat * 1000).toISOString();
    await this.devicesSqlRepository.save(device);
  }

  async updateDates(deviceId: string, refreshToken: string) {
    const deviceDocument = await this.devicesRepository.findById(deviceId);
    await this.save(deviceDocument!, refreshToken);
  }

  async checkExpirationDate(payload: any) {
    const deviceDocument = await this.devicesRepository.findById(
      payload.deviceId,
    );
    if (
      !deviceDocument ||
      !deviceDocument.expirationDate ||
      deviceDocument.expirationDate !==
        new Date(payload.exp * 1000).toISOString()
    )
      throw new UnauthorizedException();
  }

  async findByUserId(userId: string): Promise<OutputDeviceDto[]> {
    const deviceDocumentsArray =
      await this.devicesRepository.findByUserId(userId);
    return devicesViewModel(deviceDocumentsArray);
  }

  async deleteDeviceCurrentUserByDeviceId(deviceId: string, userId: string) {
    const deviceDocument = await this.devicesRepository.findById(deviceId);
    if (!deviceDocument) throw new NotFoundException();
    if (deviceDocument.userId !== userId) throw new ForbiddenException();
    await this.devicesRepository.deleteDeviceById(deviceId);
  }

  async deleteDeviceById(id: string) {
    await this.devicesRepository.deleteDeviceById(id);
  }

  async deleteAllDevicesWithoutCurrent(payload: any) {
    await this.devicesRepository.deleteDevices(payload.sub, payload.deviceId);
  }
}
