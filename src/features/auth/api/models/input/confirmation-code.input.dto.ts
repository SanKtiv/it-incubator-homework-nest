import {IsString} from "class-validator";

export class ConfirmationCodeDto {

    @IsString()
    code: string
}