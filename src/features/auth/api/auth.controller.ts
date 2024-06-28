import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { AuthService } from '../application/auth.service';
import { UserLoginDto } from './models/input/input.dto';
import { EmailResendingDto } from './models/input/email-resending.input.dto';
import { ConfirmationCodeDto } from './models/input/confirmation-code.input.dto';
import { LocalAuthGuard } from '../../../infrastructure/guards/local.auth.guard';
import { Request, Response } from 'express';
import { EmailRecoveryDto } from './models/input/email-recovery.input.dto';
import { NewPasswordInputDto } from './models/input/new-password.input.dto';
import { JWTRefreshAuthGuard } from '../../../infrastructure/guards/jwt-refresh-auth.guard';
import { CurrentUserId } from '../infrastructure/decorators/current-user-id.param.decorator';
import { RefreshTokenPayload } from '../infrastructure/decorators/refresh-token-payload.decorator';
import { DevicesService } from '../../security/application/devices.service';
import { DeviceDto } from '../../security/api/models/device.dto';
import { JWTAccessAuthGuard } from '../../../infrastructure/guards/jwt-access-auth.guard';
import { InfoCurrentUserDto } from './models/output/info-current-user.dto';
import { UsersService } from '../../users/application/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly devicesService: DevicesService,
  ) {}

  @Post('registration')
  @HttpCode(204)
  async authCreateUser(@Body() dto: UsersInputDto): Promise<void> {
    await this.usersService.existLogin(dto.login);
    await this.usersService.existEmail(dto.email);
    await this.authService.registrationUser(dto);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body() dto: ConfirmationCodeDto,
  ): Promise<void> {
    await this.authService.registrationConfirmation(dto.code);
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async resendingConfirmationCode(
    @Body() emailResendingDto: EmailResendingDto,
  ): Promise<void> {
    await this.authService.resendConfirmCode(emailResendingDto.email);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async userLogin(
    @Body() dto: UserLoginDto,
    @CurrentUserId() userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const deviceDto: DeviceDto = {
      ip: req.header('x-forwarded-for') || req.ip || '',
      title: req.headers['user-agent'] || 'chrome 105',
      userId: userId,
    };

    const deviceDocument = await this.devicesService.create(deviceDto);

    const deviceId = deviceDocument._id.toString();

    const accessToken = await this.authService.createAccessToken(userId);

    const refreshToken = await this.authService.createRefreshToken(
      userId,
      deviceId,
    );

    await this.devicesService.save(deviceDocument, refreshToken);

    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send(accessToken);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() dto: EmailRecoveryDto) {
    await this.authService.passwordRecovery(dto.email);
  }

  @Post('new-password')
  @HttpCode(204)
  async createNewPassword(@Body() dto: NewPasswordInputDto) {
    await this.authService.saveNewPassword(dto);
  }

  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(JWTRefreshAuthGuard)
  async createNewRefreshToken(
    @CurrentUserId() userId: string,
    @RefreshTokenPayload() payload: any,
    @Res() res: Response,
  ) {
    await this.devicesService.checkExpirationDate(payload);

    const accessToken = await this.authService.createAccessToken(userId);

    const refreshToken = await this.authService.createRefreshToken(
      userId,
      payload.deviceId,
    );

    await this.devicesService.updateDates(payload.deviceId, refreshToken);

    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send(accessToken);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JWTRefreshAuthGuard)
  async logout(
      @RefreshTokenPayload() payload: any,
  ) {
    await this.devicesService.checkExpirationDate(payload);
    await this.devicesService.deleteDeviceById(payload.deviceId);
  }

  @Get('me')
  @HttpCode(200)
  @UseGuards(JWTAccessAuthGuard)
  async getInfoCurrentUser(
    @CurrentUserId() userId: string,
  ): Promise<InfoCurrentUserDto> {
    return this.usersQueryRepository.infoCurrentUser(userId);
  }

  @Post('test')
  @HttpCode(204)
  async test(): Promise<void> {
    throw new BadRequestException({
      message: [{ message: 'email already confirmed', field: 'email' }],
    });
  }
}
