import { Flag } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditToDoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsEnum(Flag)
  flag?: Flag;
}
