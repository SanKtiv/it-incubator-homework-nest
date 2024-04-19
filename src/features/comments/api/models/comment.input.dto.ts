import {IsString, MinLength} from "class-validator";

export class CommentInputDto {
    @IsString()
    @MinLength(1)
    content: string;
}