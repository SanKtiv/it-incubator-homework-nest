import {IsMongoId, IsString, Length, MaxLength, MinLength} from 'class-validator';
import { NotFoundException } from '@nestjs/common';

export class InputDto {
  @Length(1, 30)
  @IsString()
  title: string;

  @Length(1, 100)
  @IsString()
  shortDescription: string;

  @Length(1, 1000)
  @IsString()
  content: string;
}
