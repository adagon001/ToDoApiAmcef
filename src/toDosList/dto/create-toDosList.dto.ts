import { ToDo } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ToDoDtoResponse } from 'src/toDo/dto/create-toDo.dto';

export class CreateToDosListDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class toDosListDtoResponse {
  id: number;
  title: string;
  toDos: ToDoDtoResponse[];
}
