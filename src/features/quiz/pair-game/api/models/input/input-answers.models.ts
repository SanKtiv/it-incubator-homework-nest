import {IsString, Length} from "class-validator";

export class InputAnswersModels {
    @IsString()
    @Length(6, 1000, { message: 'Login length incorrect' })
    answer: string;
}