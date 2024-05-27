import {IsMongoId, IsString, MaxLength, MinLength} from 'class-validator';
import {NotFoundException} from "@nestjs/common";

export class InputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title: string;
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  shortDescription: string;
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
