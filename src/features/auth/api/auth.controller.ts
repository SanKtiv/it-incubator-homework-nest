import {
  Body,
  Controller,
  HttpCode,
  Post,
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
import { Response } from 'express';
import {EmailRecoveryDto} from "./models/input/email-recovery.input.dto";

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
    await this.authService.resendingCode(emailResendingDto.email);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async userLogin(@Body() dto: UserLoginDto, @Res() res: Response) {
    const accessToken = await this.authService.createAccessToken(
      dto.loginOrEmail,
    );

    const refreshToken = await this.authService.createRefreshToken(
      dto.loginOrEmail,
    );

    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send(accessToken);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() dto: EmailRecoveryDto) {
    await this.authService.passwordRecovery(dto.email)
  }
}
