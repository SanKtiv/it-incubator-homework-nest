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
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { UsersQuery } from './models/input/users.query.dto';
import { UsersQueryRepositoryMongo } from '../infrastructure/mongodb/users.query.repository-mongo';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { UsersQueryRepositorySql } from '../infrastructure/postgresqldb/users.query.repository-sql';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    //private readonly usersQueryRepository: UsersQueryRepositoryMongo,
    private readonly usersQueryRepositorySql: UsersQueryRepositorySql,
  ) {}

  @Post()
  async createUser(@Body() dto: UsersInputDto) {
    const user = await this.usersService.createUser(dto);
    return usersOutputDto(user);
  }

  @Get()
  async getUsersPaging(@Query() query: UsersQuery) {
    return await this.usersQueryRepositorySql.findPaging_RAW(query);
  }

  @Delete(':userId')
  @HttpCode(204)
  @UsePipes(paramIdIsUUIdPipe)
  async deleteUserById(@Param('userId') id: string) {
    const result = await this.usersService.deleteUserById(id);
    if (!result) throw new NotFoundException();
  }
}
