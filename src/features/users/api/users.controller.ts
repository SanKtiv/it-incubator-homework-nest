import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersInputDto } from './models/input/users.input.dto';
import { UsersService } from '../application/users.service';
import {
  usersOutputDto,
  usersPagingDto,
} from './models/output/users.output.dto';
import { paramIdIsMongoIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { UsersQuery } from './models/input/users.query.dto';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() dto: UsersInputDto) {
    await this.usersService.existLogin(dto.login);
    await this.usersService.existEmail(dto.email);
    const userDocument = await this.usersService.createUser(dto);
    return usersOutputDto(userDocument);
  }

  @Get()
  async getUsersPaging(@Query() query: UsersQuery) {
    const totalUsers = await this.usersQueryRepository.countDocument(query);
    const usersPaging = await this.usersQueryRepository.findPaging(query);
    return usersPagingDto(totalUsers, query, usersPaging);
  }

  @Delete(':userId')
  @HttpCode(204)
  @UsePipes(paramIdIsMongoIdPipe)
  async deleteUserById(@Param('userId') id: string) {
    const result = await this.usersService.deleteUserById(id);
    if (!result) throw new NotFoundException();
  }
}
