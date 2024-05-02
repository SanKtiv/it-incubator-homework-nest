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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
  ) {}

  @Post('registration')
  @HttpCode(204)
  async authCreateUser(@Body() dto: UsersInputDto) {
    const userDocument = await this.usersQueryRepository.findByEmail(dto.email);
    if (userDocument)
      throw new BadRequestException([
        {
          message: 'User with the given email or login already exists',
          field: 'login or email',
        },
      ]);
    await this.authService.createAuthUser(dto);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() code: string) {
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
}
