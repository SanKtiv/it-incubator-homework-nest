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
import {DevicesRepositoryORM} from "../infrastructure/postgresqldb/devices.repository-TypeORM";
import {AccessJwtToken} from "../../auth/application/use-cases/access-jwt-token";
import {RefreshJwtToken} from "../../auth/application/use-cases/refresh-jwt-token";

@Injectable()
export class DevicesService {
  constructor(
    //private readonly devicesRepository: DevicesRepositoryMongo,
    private readonly devicesRepository: DevicesRepositoryORM,
    private readonly jwtService: JwtService,
    private readonly accessTokenService: AccessJwtToken,
    private readonly refreshTokenService: RefreshJwtToken
  ) {}

  async create(dto: DeviceDto): Promise<DeviceTable> {
    return this.devicesRepository.create(dto);

  }

  async save(device: DeviceTable, token: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(token);
    device.expirationDate = new Date(payload.exp * 1000).toISOString();
    device.lastActiveDate = new Date(payload.iat * 1000).toISOString();
    await this.devicesRepository.save(device);
  }

  async updateDevice(payload: any, userId: string) {
    const device = await this.checkExpirationDate(payload);

    const refreshToken = await this.refreshTokenService.create(
        userId,
        payload.deviceId,
    );

    const newPayload = await this.refreshTokenService.verify(refreshToken);

    device.expirationDate = new Date(newPayload.exp * 1000).toISOString();
    device.lastActiveDate = new Date(newPayload.iat * 1000).toISOString();

    await this.devicesRepository.save(device);

    const accessToken = await this.accessTokenService.create(userId);

    return {accessToken, refreshToken}
  }

  async checkExpirationDate(payload: any) {
    const device = await this.devicesRepository.findById(
      payload.deviceId,
    );
    if (
      !device ||
      !device.expirationDate ||
      device.expirationDate !==
        new Date(payload.exp * 1000).toISOString()
    )
      throw new UnauthorizedException();

    return device;
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

  async deleteDeviceById(payload: any) {
    const device = await this.checkExpirationDate(payload);
    await this.devicesRepository.deleteDeviceById(device.id);
  }

  async deleteAllDevicesWithoutCurrent(payload: any) {
    await this.devicesRepository.deleteDevices(
      payload.sub,
      payload.deviceId,
    );
  }
}
