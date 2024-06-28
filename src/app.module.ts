import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ToDoModule } from './toDo/toDo.module';
import { ToDosListModule } from './toDosList/toDosListmodule';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ToDoModule,
    ToDosListModule,
    PrismaModule,
  ],
})
export class AppModule {}
