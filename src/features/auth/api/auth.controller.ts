import {Body, Controller, Post} from "@nestjs/common";
import {UsersInputDto} from "../../users/api/models/input/users.input.dto";

@Controller('auth')
export class AuthController {

    @Post('registration')
    async authCreateUser(@Body() dto: UsersInputDto) {
        return dto;
    }
}