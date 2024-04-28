import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import {UsersQueryRepository} from "../../users/infrastructure/users.query.repository";

@Controller('auth')
export class AuthController {

  constructor(private readonly usersQueryRepository: UsersQueryRepository) {
  }

  @Post('registration')
  async authCreateUser(@Body() dto: UsersInputDto) {
    const userDocument = await this.usersQueryRepository.findByEmail(dto.email)
    if (!userDocument) throw new BadRequestException([{
      message: 'User with the given email or login already exists',
      field: 'email'
    }])
    console.log(userDocument)
    return dto;
  }
}
