import { Module } from '@nestjs/common';
import { ToDoController } from './toDo.controller';
import { ToDoService } from './toDo.service';

@Module({
  controllers: [ToDoController],
  providers: [ToDoService],
})
export class ToDoModule {}
