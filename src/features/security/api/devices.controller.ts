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
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';

@Controller('security/devices')
@UseGuards(JWTRefreshAuthGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @HttpCode(200)
  async getDevices(@CurrentUserId() userId: string) {
    return this.devicesService.findByUserId(userId);
  }

  @Delete(':deviceId')
  @HttpCode(204)
  async deleteDeviceById(
    @Param('deviceId', paramIdIsUUIdPipe) id: string,
    @CurrentUserId() userId: string,
  ) {
    await this.devicesService.deleteDeviceCurrentUserByDeviceId(id, userId);
  }

  @Delete()
  @HttpCode(204)
  async deleteDevices(@RefreshTokenPayload() payload: any) {
    await this.devicesService.deleteAllDevicesWithoutCurrent(payload);
  }
}
