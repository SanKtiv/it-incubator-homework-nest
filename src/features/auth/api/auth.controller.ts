import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { AuthService } from '../application/auth.service';
import {UserLoginDto} from "./models/input/input.dto";
import {EmailResendingDto} from "./models/input/email-resending.input.dto";

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
  async registrationConfirmation(@Body() code: string): Promise<void> {
    const userDocument = await this.usersQueryRepository.findByCode(code);
    if (
      !userDocument ||
      userDocument.emailConfirmation.expirationDate < new Date()
    )
      throw new BadRequestException([
        {
          message:
            'Confirmation code is incorrect, expired or already been applied',
          field: 'code',
        },
      ]);
    await this.authService.registrationConfirmation(userDocument)
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async resendingConfirmationCode(@Body() emailResendingDto: EmailResendingDto): Promise<void> {
    await this.authService.resendingCode(emailResendingDto.email)
  }

  @Post('login')
  async userLogin(@Body() dto: UserLoginDto) {
    const userDocument = await this.usersQueryRepository.findUserByLoginOrEmail(dto.loginOrEmail)
  }
}
