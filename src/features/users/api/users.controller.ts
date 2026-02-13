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
import { usersOutputDto } from './models/output/users.output.dto';
import { paramIdIsUUIdPipe } from '../../../infrastructure/pipes/validation.pipe';
import { UsersQuery } from './models/input/users.query.dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.guard';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import {ApiBasicAuth, ApiParam} from "@nestjs/swagger";

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() dto: UsersInputDto) {
    const user = await this.usersService.createUser(dto);
    return usersOutputDto(user);
  }

  @Get()
  async getUsersPaging(@Query() query: UsersQuery) {
    return await this.usersQueryRepository.getUsersPaging(query);
  }

  @Delete(':userId')
  @HttpCode(204)
  @UsePipes(paramIdIsUUIdPipe)
  // @ApiParam({name: 'userId'})
  async deleteUserById(@Param('userId') id: string) {
    await this.usersService.deleteUserById(id);
  }
}
