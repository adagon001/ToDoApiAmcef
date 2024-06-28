import {
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditToDoDto } from './dto';
import { ToDoService } from './toDo.service';
import { CreateToDoDto, ToDoDtoResponse } from './dto/create-toDo.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('toDo')
@ApiTags('ToDo')
export class ToDoController {
  constructor(private toDoService: ToDoService) { }

  @Post()
  @ApiCreatedResponse({
    type: ToDoDtoResponse,
  })
  createToDo(
    @GetUser('id') userId: number,
    @Body() dto: CreateToDoDto,
  ) {
    return this.toDoService.createToDo(
      userId,
      dto,
    );
  }

  @Patch(":id")
  @ApiCreatedResponse({
    type: ToDoDtoResponse,
  })
  editUser(
    @Param('id', ParseIntPipe)
    toDoId: number,
    @GetUser('id') userId: number,
    @Body() dto: EditToDoDto,
  ) {
    return this.toDoService.editToDo(toDoId, userId, dto);
  }
}
