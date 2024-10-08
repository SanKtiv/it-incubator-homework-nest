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
import { UsersQueryRepository } from '../infrastructure/mongodb/users.query.repository';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { UsersSqlQueryRepository } from '../infrastructure/postgresqldb/users.sql.query.repository';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersSqlQueryRepository: UsersSqlQueryRepository,
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
    //console.log(query)
    //const totalUsers = await this.usersSqlQueryRepository.countDocument(query);for mongo
    //const usersPaging = await this.usersSqlQueryRepository.findPaging(query);for mongo
    //return usersPagingDto(totalUsers, query, usersPaging);for mongo
    return await this.usersSqlQueryRepository.findPaging(query);
  }

  @Delete(':userId')
  @HttpCode(204)
  @UsePipes(paramIdIsMongoIdPipe)
  async deleteUserById(@Param('userId') id: string) {
    const result = await this.usersService.deleteUserById(id);
    if (!result) throw new NotFoundException();
  }
}
