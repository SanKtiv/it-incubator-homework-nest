import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JWTRefreshAuthGuard } from '../../../infrastructure/guards/jwt-refresh-auth.guard';
import { RefreshTokenPayload } from '../../auth/infrastructure/decorators/refresh-token-payload.decorator';
import { CurrentUserId } from '../../auth/infrastructure/decorators/current-user-id.param.decorator';
import { DevicesService } from '../application/devices.service';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';

@Controller('security')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get('devices')
  @HttpCode(200)
  @UseGuards(JWTRefreshAuthGuard)
  async getDevices(@CurrentUserId() userId: string) {
    console.log('security/devices start');
    console.log('userId =', userId);
    return this.devicesService.findByUserId(userId);
  }

  @Delete('devices/:deviceId')
  @HttpCode(204)
  @UseGuards(JWTRefreshAuthGuard)
  async deleteDeviceById(
    @Param(':deviceId', paramIdIsMongoIdPipe) id: string,
    @CurrentUserId() userId: string,
  ) {
    await this.devicesService.deleteDeviceCurrentUserByDeviceId(id, userId);
  }

  @Delete('devices')
  @HttpCode(204)
  @UseGuards(JWTRefreshAuthGuard)
  async deleteDevices(@RefreshTokenPayload() payload: any) {
    await this.devicesService.deleteAllDevicesWithoutCurrent(payload);
  }
}
