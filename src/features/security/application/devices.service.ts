import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DevicesRepositoryMongo } from '../infrastructure/mongodb/devices.repository-mongo';
import { DeviceDto } from '../api/models/device.dto';
import { DeviceDocument } from '../domain/device.schema';
import { JwtService } from '@nestjs/jwt';
import {
  devicesViewModel,
  OutputDeviceDto,
} from '../api/models/output-device.dto';
import { DevicesRepositorySql } from '../infrastructure/postgresqldb/devices.repository-sql';
import { DeviceTable } from '../domain/device.table';

@Injectable()
export class DevicesService {
  constructor(
    //private readonly devicesRepository: DevicesRepositoryMongo,
    private readonly devicesSqlRepository: DevicesRepositorySql,
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
    const deviceDocument = await this.devicesSqlRepository.findById(deviceId);
    await this.save(deviceDocument!, refreshToken);
  }

  async checkExpirationDate(payload: any) {
    const deviceDocument = await this.devicesSqlRepository.findById(
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
      await this.devicesSqlRepository.findByUserId(userId);
    return devicesViewModel(deviceDocumentsArray);
  }

  async deleteDeviceCurrentUserByDeviceId(deviceId: string, userId: string) {
    const deviceDocument = await this.devicesSqlRepository.findById(deviceId);
    if (!deviceDocument) throw new NotFoundException();
    if (deviceDocument.userId !== userId) throw new ForbiddenException();
    await this.devicesSqlRepository.deleteDeviceById(deviceId);
  }

  async deleteDeviceById(id: string) {
    await this.devicesSqlRepository.deleteDeviceById(id);
  }

  async deleteAllDevicesWithoutCurrent(payload: any) {
    await this.devicesSqlRepository.deleteDevices(
      payload.sub,
      payload.deviceId,
    );
  }
}
