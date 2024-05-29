import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersInputDto } from './models/input/users.input.dto';
import { UsersService } from '../application/users.service';
import {
  usersOutputDto,
  usersPagingDto,
} from './models/output/users.output.dto';
import {paramIdIsMongoIdPipe, paramIdPipe} from '../../../infrastructure/pipes/validation.pipe';
import { UsersQuery } from './models/input/users.query.dto';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { UserGuard } from '../../../infrastructure/guards/notfound.guard';
import {BasicAuthGuard} from "../../../infrastructure/guards/basic.guard";

@Controller('users')
@UseGuards(BasicAuthGuard)
// @UsePipes(new ValidationPipe({ transform: true }))
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

  @Delete(':userId')
  @HttpCode(204)
  //@UseGuards(UserGuard)
  @UsePipes(paramIdIsMongoIdPipe)
  async deleteUserById(@Param('userId') id: string) {
    const result = await this.usersService.deleteUserById(id);

    if (!result) throw new NotFoundException();
  }
}
