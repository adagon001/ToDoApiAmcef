import { Flag } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateToDoDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;

  @IsOptional()
  @IsEnum(Flag)
  flag?: Flag;

  @IsInt()
  @IsNotEmpty()
  listId: number;
}

export class ToDoDtoResponse {
  id: number;
  title: string;
  description?: string;
  deadline?: Date;
  flag?: Flag;
}
