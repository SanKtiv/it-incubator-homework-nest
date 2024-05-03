import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersInputDto } from './models/input/users.input.dto';
import { UsersService } from '../application/users.service';
import {
  usersOutputDto,
  usersPagingDto,
} from './models/output/users.output.dto';
import { paramIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { UsersQuery } from './models/input/users.query.dto';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import {UserGuard} from "../../../infrastructure/guards/notfound.guard";

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() userInputDto: UsersInputDto) {
    const userDocument = await this.usersService.createUser(userInputDto);
    return usersOutputDto(userDocument);
  }

  @Get()
  async getUsersPaging(@Query() query: UsersQuery) {
    const totalUsers = await this.usersQueryRepository.countDocument(query);
    const usersPaging = await this.usersQueryRepository.findPaging(query);
    return usersPagingDto(totalUsers, query, usersPaging);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(UserGuard)
  @UsePipes(paramIdPipe)
  async deleteUserById(@Param('id') id: string) {
    await this.usersService.deleteUserById(id);
  }
}
