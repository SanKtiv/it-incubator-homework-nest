import {
  Body,
  Controller, Get,
  HttpCode,
  Post, Req,
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
import {EmailRecoveryDto} from "./models/input/email-recovery.input.dto";
import {NewPasswordInputDto} from "./models/input/new-password.input.dto";
import {JWTRefreshAuthGuard} from "../../../infrastructure/guards/jwt-refresh-auth.guard";
import {CurrentUserId} from "../infrastructure/decorators/current-user-id.param.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
  ) {}

  @Post('registration')
  @HttpCode(204)
  async authCreateUser(@Body() dto: UsersInputDto): Promise<void> {
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
      @Req() reg: Request,
      @Res() res: Response
  ) {
    const deviceDto = {
      ip: req.header('x-forwarded-for') || req.ip || '',
      title: req.headers["user-agent"] || 'chrome 105'
    }

    const accessToken = await this.authService.createAccessToken(userId);

    const refreshToken = await this.authService.createRefreshToken(userId);

    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send(accessToken);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() dto: EmailRecoveryDto) {
    await this.authService.passwordRecovery(dto.email)
  }

  @Post('new-password')
  @HttpCode(204)
  async createNewPassword(@Body() dto: NewPasswordInputDto) {
    await this.authService.saveNewPassword(dto)
  }

  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(JWTRefreshAuthGuard)
  async createNewRefreshToken(@CurrentUserId() userId: string, @Res() res: Response) {
    const accessToken = await this.authService.createAccessToken(userId);

    const refreshToken = await this.authService.createRefreshToken(userId);

    return res
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        .send(accessToken);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JWTRefreshAuthGuard)
  async logout(@CurrentUserId() userId: string) {
  }

  @Get('me')
  @HttpCode(200)
  async getInfoCurrentUser() {
  }
}
