import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
} from './models/output/users.output.dto';
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { UsersQuery } from './models/input/users.query.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import {UsersQueryRepositoryOrm} from "../infrastructure/postgresqldb/users.query.repository-typeorm";

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepositoryOrm,
  ) {}

  @Post()
  async createUser(@Body() dto: UsersInputDto) {
    const user = await this.usersService.createUser(dto);
    return usersOutputDto(user);
  }

  @Get()
  async getUsersPaging(@Query() query: UsersQuery) {
    return await this.usersQueryRepository.findPaging(query);
  }

  @Delete(':userId')
  @HttpCode(204)
  @UsePipes(paramIdIsUUIdPipe)
  async deleteUserById(@Param('userId') id: string) {
    await this.usersService.deleteUserById(id);
  }
}
