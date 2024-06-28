import { ToDo } from '@prisma/client';
import { IsString } from 'class-validator';

export class EditToDosListDto {
  @IsString()
  title: string;
}
