import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DeviceDto } from '../api/models/device.dto';
import { JwtService } from '@nestjs/jwt';
import {
  devicesViewModel,
  OutputDeviceDto,
} from '../api/models/output-device.dto';
import { DeviceTable } from '../domain/device.table';
import { AccessJwtToken } from '../../auth/application/use-cases/access-jwt-token';
import { RefreshJwtToken } from '../../auth/application/use-cases/refresh-jwt-token';
import { DevicesRepository } from '../infrastructure/devices.repository';

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly jwtService: JwtService,
    private readonly accessTokenService: AccessJwtToken,
    private readonly refreshTokenService: RefreshJwtToken,
  ) {}

  async create(dto: DeviceDto): Promise<string> {
    const device = await this.devicesRepository.create(dto);
    const refreshToken = await this.refreshTokenService.create(
      dto.userId,
      device.id,
    );

    await this.save(device, refreshToken);

    return refreshToken;
  }

  async save(device: DeviceTable, token: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(token);
    device.expirationDate = new Date(payload.exp * 1000).toISOString();
    device.lastActiveDate = new Date(payload.iat * 1000).toISOString();
    await this.devicesRepository.save(device);
  }

  async updateDevice(payload: any, userId: string): Promise<string> {
    const device = await this.checkExpirationDate(payload);
    const refreshToken = await this.refreshTokenService.create(
      userId,
      payload.deviceId,
    );
    const newPayload = await this.refreshTokenService.verify(refreshToken);

    device.expirationDate = new Date(newPayload.exp * 1000).toISOString();
    device.lastActiveDate = new Date(newPayload.iat * 1000).toISOString();

    await this.devicesRepository.save(device);

    return refreshToken;
  }

  async checkExpirationDate(payload: any) {
    const device = await this.devicesRepository.findById(payload.deviceId);
    if (
      !device ||
      !device.expirationDate ||
      device.expirationDate !== new Date(payload.exp * 1000).toISOString()
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
    await this.devicesRepository.deleteById(deviceId);
  }

  async deleteDeviceById(payload: any) {
    const device = await this.checkExpirationDate(payload);
    await this.devicesRepository.deleteById(device.id);
  }

  async deleteAllDevicesWithoutCurrent(payload: any) {
    await this.devicesRepository.deleteManyByUserId(
      payload.sub,
      payload.deviceId,
    );
  }
}
