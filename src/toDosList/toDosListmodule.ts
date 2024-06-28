import { Module } from '@nestjs/common';
import { toDosListController } from './toDosList.controller';
import { ToDosListService } from './toDosList.service';

@Module({
  controllers: [toDosListController],
  providers: [ToDosListService],
})
export class ToDosListModule {}
