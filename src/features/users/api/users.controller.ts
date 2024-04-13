import {Body, Controller, Post} from "@nestjs/common";
import {UsersInputDto} from "./models/input/users.input.dto";
import {UsersService} from "../application/users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }
    @Post()
    async createUser(@Body() userInputDto: UsersInputDto) {
        return this.usersService.createUser(userInputDto)
    }
}