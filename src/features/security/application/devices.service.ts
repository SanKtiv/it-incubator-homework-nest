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
        deviceDocument.expirationDate !== new Date(payload.exp * 1000).toISOString()
    )
      throw new UnauthorizedException();
  }

  async findByUserId(userId: string): Promise<OutputDeviceDto[]> {
    console.log('findByUserId start')
    const deviceDocumentsArray =
      await this.devicesRepository.findByUserId(userId);
    console.log('deviceDocumentsArray =',deviceDocumentsArray)
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
