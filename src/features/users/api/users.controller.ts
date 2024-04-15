import {Body, Controller, Delete, Get, Param, Post, Query, UsePipes} from '@nestjs/common';
import { UsersInputDto } from './models/input/users.input.dto';
import { UsersService } from '../application/users.service';
import {usersOutputDto} from './models/output/users.output.dto';
import {paramIdPipe} from "../../../infrastructure/pipes/validation.pipe";
import {UsersQuery} from "./models/input/users.query.dto";
import {UsersQueryRepository} from "../infrastructure/users.query.repository";

@Controller('users')
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
    const usersPaging = await this.usersQueryRepository.findPaging(query)
  }

  @Delete(':userId')
  @UsePipes(paramIdPipe)
  async deleteUserById(@Param('userId') id: string) {
    await this.usersService.deleteUserById(id)
  }
}
