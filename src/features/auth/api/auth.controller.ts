import {Body, Controller, InternalServerErrorException, Post} from "@nestjs/common";
import {UsersInputDto} from "../../users/api/models/input/users.input.dto";

@Controller('auth')
export class AuthController {

    @Post('registration')
    async authCreateUser(@Body() dto: UsersInputDto) {
        if (true) throw new InternalServerErrorException()
        //return dto;
    }
}